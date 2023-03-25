import { getAddress } from '@ethersproject/address'
import { BigNumber } from '@ethersproject/bignumber'
import {
  ParticipantsDocument,
  ParticipantsQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { emailServerClient } from 'lib/api/postmark'
import { sudoPublicDbClient } from 'lib/api/supabase'
import client from 'lib/apollo/client'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'
import { getLogger } from 'lib/logger'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { fromWad } from 'utils/format/formatNumber'
import { getProjectMetadata } from 'utils/server/metadata'
import * as Yup from 'yup'

const JUICE_API_BEARER_TOKEN = process.env.JUICE_API_BEARER_TOKEN
const JUICE_API_EVENTS_ENABLED = process.env.JUICE_API_EVENTS_ENABLED === 'true'

const logger = getLogger('api/events/on-pay')

const BigNumberValidator = (errorMessage: string) => {
  return Yup.mixed<BigNumber>()
    .transform(current => {
      try {
        return BigNumber.from(current)
      } catch (e) {
        return undefined
      }
    })
    .test('is-big-number', errorMessage, value => BigNumber.isBigNumber(value))
}

const Schema = Yup.object().shape({
  fundingCycleConfiguration: BigNumberValidator(
    'fundingCycleConfiguration must be an ethers BigNumber',
  ).required(),
  fundingCycleNumber: BigNumberValidator(
    'fundingCycleNumber must be an ethers BigNumber',
  ).required(),
  projectId: BigNumberValidator(
    'projectId must be an ethers BigNumber',
  ).required(),
  payer: Yup.string().required(),
  beneficiary: Yup.string().required(),
  amount: BigNumberValidator('amount must be an ethers BigNumber').required(),
  beneficiaryTokenCount: BigNumberValidator(
    'beneficiaryTokenCount must be an ethers BigNumber',
  ).required(),
  memo: Yup.string(),
  metadata: Yup.string().required(),
  caller: Yup.string().required(),
})

type OnPayEvent = Awaited<ReturnType<typeof Schema.validate>>

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST' || !JUICE_API_EVENTS_ENABLED) {
      return res.status(404).json({ message: 'Not found.' })
    }
    if (
      JUICE_API_BEARER_TOKEN &&
      req.headers.authorization !== `Bearer ${JUICE_API_BEARER_TOKEN}`
    ) {
      return res.status(401).json({ message: 'Unauthorized.' })
    }
    const event = await Schema.validate(req.body)

    const userEmails = await findSubscribedUserEmailsForProjectId(
      event.projectId.toNumber(),
    )

    const emailMetadata = await compileEmailMetadata(event)
    await sendEmails(emailMetadata, userEmails)

    return res.status(200).json('Success!')
  } catch (e) {
    logger.error({ error: e })
    return res
      .status(500)
      .json({ message: 'Unexpected server error occurred.' })
  }
}

type EmailMetadata = {
  amount: string
  payerName: string
  payerEthscanUrl: string
  timestamp: string
  projectUrl: string
  projectName: string
}

const compileEmailMetadata = async ({
  projectId,
  amount,
  payer,
}: OnPayEvent): Promise<EmailMetadata> => {
  const formattedAmount = fromWad(amount.toString())
  const normalizedPayerAddress = getAddress(payer)
  const { name: payerEnsName } = await resolveAddressEnsIdeas(
    normalizedPayerAddress,
  )
  const payerName =
    payerEnsName ?? truncateEthAddress({ address: normalizedPayerAddress })
  const payerEthscanUrl = `https://etherscan.io/address/${normalizedPayerAddress}`
  const formattedTimestamp = moment(new Date())
    .utc()
    .format('YYYY-MM-DD h:mma (UTC)')
  const projectUrl = `https://juicebox.money/v2/p/${projectId}`

  let projectName = `Project ${projectId.toString()}`
  try {
    const projectMetadata = await getProjectMetadata(projectId.toNumber())
    if (projectMetadata?.name) {
      projectName = projectMetadata.name
    }
  } catch (e) {
    console.error('failed to get project name', {
      projectId: projectId.toString(),
      e,
    })
  }

  return {
    amount: formattedAmount,
    payerName,
    payerEthscanUrl,
    timestamp: formattedTimestamp,
    projectUrl,
    projectName,
  }
}

const sendEmails = async (metadata: EmailMetadata, emails: string[]) => {
  const res = await emailServerClient().sendEmailBatchWithTemplates(
    emails.map(email => ({
      From: 'noreply@juicebox.money',
      To: email,
      TemplateAlias: 'payment-received',
      TemplateModel: {
        product_url: 'https://juicebox.money',
        project_name: metadata.projectName,
        amount: metadata.amount,
        payer_ethscan_url: metadata.payerEthscanUrl,
        payer_name: metadata.payerName,
        timestamp: metadata.timestamp,
        project_url: metadata.projectUrl,
      },
      MessageStream: 'broadcast',
    })),
  )

  logger.info({
    message: 'broadcasted payment-received email',
    messageIds: res.map(r => r.MessageID),
  })
}

const findSubscribedUserEmailsForProjectId = async (
  projectId: number,
): Promise<string[]> => {
  const walletsToProject = (
    await client.query<ParticipantsQuery, QueryParticipantsArgs>({
      query: ParticipantsDocument,
      variables: { where: { projectId } },
    })
  ).data.participants.map(p => p.wallet.id.toLowerCase())

  const orQuery = walletsToProject
    .map(wallet => `wallet.eq.${wallet}`)
    .join(',')
  const usersResult = await sudoPublicDbClient
    .from('users')
    .select('email')
    .eq('email_verified', true)
    .not('email', 'is', null)
    .or(orQuery)
  if (usersResult.error) throw usersResult.error
  return usersResult.data.map(u => u.email) as string[]
}

export default handler
