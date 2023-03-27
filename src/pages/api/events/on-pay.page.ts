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
  blockHash: Yup.string().required(),
  blockNumber: Yup.number(),
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

    const emailEvents = await findEmailEventsForProjectId(
      event.projectId.toNumber(),
      event.payer.toLowerCase(),
    )
    const emailMetadata = await compileEmailMetadata(event)

    await sendEmails(emailMetadata, emailEvents)

    return res.status(200).json('Success!')
  } catch (e) {
    logger.error({ error: e })
    return res
      .status(500)
      .json({ message: 'Unexpected server error occurred.' })
  }
}

enum EmailType {
  PayEvent = 'payment-received',
  PayReceipt = 'payment-receipt',
}

type EmailEvent = {
  email: string
  type: EmailType
}

type EmailMetadata = {
  amount: string
  payerName: string
  payerEthscanUrl: string
  timestamp: string
  projectUrl: string
  projectName: string
  // Used in transaction receipt
  transactionUrl: string | undefined
  // Used in transaction receipt
  transactionName: string | undefined
}

const compileEmailMetadata = async ({
  projectId,
  amount,
  payer,
  blockHash,
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

  const transactionName = blockHash
  const transactionUrl = `https://etherscan.io/block/${blockHash}`

  return {
    amount: formattedAmount,
    payerName,
    payerEthscanUrl,
    timestamp: formattedTimestamp,
    projectUrl,
    projectName,
    transactionName,
    transactionUrl,
  }
}

const sendEmails = async (
  metadata: EmailMetadata,
  emailEvents: EmailEvent[],
) => {
  const res = await emailServerClient().sendEmailBatchWithTemplates(
    emailEvents.map(({ email, type }) => ({
      From: 'noreply@juicebox.money',
      To: email,
      TemplateAlias: type as string,
      TemplateModel: {
        product_url: 'https://juicebox.money',
        project_name: metadata.projectName,
        amount: metadata.amount,
        payer_ethscan_url: metadata.payerEthscanUrl,
        payer_name: metadata.payerName,
        timestamp: metadata.timestamp,
        project_url: metadata.projectUrl,
        tx_name: metadata.transactionName,
        tx_url: metadata.transactionUrl,
        juicebox_project_url: 'https://juicebox.money/@juicebox',
      },
      MessageStream: 'broadcast',
    })),
  )

  logger.info({
    message: 'broadcasted payment-received email',
    messageIds: res.map(r => r.MessageID),
  })
}

/**
 * Retrieves email events associated with a given project and payer's wallets.
 * @param projectId - The ID of the project to search for.
 * @param payer - The wallet address of the payer to search for.
 * @returns An array of email events, each containing an associated email and email type (PayReceipt).
 * @throws If there is an error with the database query.
 */
const findEmailEventsForProjectId = async (
  projectId: number,
  payer: string,
): Promise<EmailEvent[]> => {
  const walletsToProject = (
    await client.query<ParticipantsQuery, QueryParticipantsArgs>({
      query: ParticipantsDocument,
      variables: { where: { projectId } },
    })
  ).data.participants.map(p => p.wallet.id.toLowerCase())

  const orQuery = [...walletsToProject, payer]
    .map(wallet => `wallet.eq.${wallet}`)
    .join(',')
  const usersResult = await sudoPublicDbClient
    .from('users')
    .select('email,wallet')
    .eq('email_verified', true)
    .not('email', 'is', null)
    .or(orQuery)
  if (usersResult.error) throw usersResult.error
  return usersResult.data.map(u => ({
    email: u.email as string,
    type: u.wallet === payer ? EmailType.PayReceipt : EmailType.PayEvent,
  }))
}

export default handler
