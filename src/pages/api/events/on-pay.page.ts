import { BigNumber } from '@ethersproject/bignumber'
import {
  ParticipantsDocument,
  ParticipantsQuery,
  QueryParticipantsArgs,
} from 'generated/graphql'
import { emailServerClient } from 'lib/api/postmark'
import { sudoPublicDbClient } from 'lib/api/supabase'
import client from 'lib/apollo/client'
import { getLogger } from 'lib/logger'
import { NextApiRequest, NextApiResponse } from 'next'
import { fromWad } from 'utils/format/formatNumber'
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

    await sendEmails(event, userEmails)

    return res.status(200).json('Success!')
  } catch (e) {
    logger.error({ error: e })
    return res
      .status(500)
      .json({ message: 'Unexpected server error occurred.' })
  }
}

const sendEmails = async (
  { projectId, amount }: OnPayEvent,
  emails: string[],
) => {
  const sendResponse = await emailServerClient().sendEmailBatchWithTemplates(
    emails.map(email => ({
      From: 'noreply@juicebox.money',
      To: email,
      TemplateAlias: 'payment-received',
      TemplateModel: {
        product_url: 'https://juicebox.money',
        amount: fromWad(amount.toString()),
        project_id: projectId,
      },
      MessageStream: 'broadcast',
    })),
  )

  logger.info({
    message: 'broadcasted payment-received email',
    messageIds: sendResponse.map(r => r.MessageID),
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
