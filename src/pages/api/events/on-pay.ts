import { utils } from 'ethers'
import { emailServerClient } from 'lib/api/postmark'
import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { authCheck } from 'lib/auth'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'
import { getLogger } from 'lib/logger'
import { ProjectNotification } from 'models/notifications/projectNotifications'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  paymentReceiptTemplate,
  paymentReceivedTemplate,
} from 'templates/email/payments'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { fromWad } from 'utils/format/formatNumber'
import { getProjectMetadata } from 'utils/server/metadata'
import * as Yup from 'yup'

const JUICE_API_EVENTS_ENABLED = process.env.JUICE_API_EVENTS_ENABLED === 'true'

const logger = getLogger('api/events/on-pay')

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

type OnPayEvent = Awaited<ReturnType<typeof Schema.validate>>

const BigIntValidator = (errorMessage: string) => {
  return Yup.mixed<bigint>()
    .transform(current => {
      try {
        return BigInt(current)
      } catch (e) {
        return undefined
      }
    })
    .test('is-bigint', errorMessage, value => typeof value === 'bigint')
}

const Schema = Yup.object().shape({
  data: Yup.object().shape({
    fundingCycleConfiguration: BigIntValidator(
      'fundingCycleConfiguration must be a BigInt',
    ).required(),
    fundingCycleNumber: BigIntValidator(
      'fundingCycleNumber must be a BigInt',
    ).required(),
    projectId: BigIntValidator('projectId must be a BigInt').required(),
    payer: Yup.string().required(),
    beneficiary: Yup.string().required(),
    amount: BigIntValidator('amount must be a BigInt').required(),
    beneficiaryTokenCount: BigIntValidator(
      'beneficiaryTokenCount must be a BigInt',
    ).required(),
    memo: Yup.string(),
    metadata: Yup.string().required(),
  }),
  metadata: Yup.object().shape({
    transactionHash: Yup.string().required(),
    // TODO add more fields if needed
  }),
})

const compileEmailMetadata = async ({
  data: { projectId, amount, payer },
  metadata: { transactionHash },
}: OnPayEvent): Promise<EmailMetadata> => {
  const formattedAmount = fromWad(amount.toString())
  const normalizedPayerAddress = utils.getAddress(payer)
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
    const projectMetadata = await getProjectMetadata(Number(projectId))
    if (projectMetadata?.name) {
      projectName = projectMetadata.name
    }
  } catch (e) {
    console.error('failed to get project name', {
      projectId: projectId.toString(),
      e,
    })
  }

  const transactionName = transactionHash
  const transactionUrl = `https://etherscan.io/tx/${transactionHash}`

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
  const templateData = {
    project_name: metadata.projectName,
    amount: metadata.amount,
    payer_name: metadata.payerName,
    timestamp: metadata.timestamp,
    project_url: metadata.projectUrl,
    tx_url: metadata.transactionUrl,
    tx_name: metadata.transactionName,
    juicebox_project_url: 'https://juicebox.money/@juicebox',
  }
  const paymentReceiptEmail = paymentReceiptTemplate(templateData)
  const paymentReceivedEmail = paymentReceivedTemplate(templateData)

  const res = await emailServerClient().sendEmailBatch(
    emailEvents.map(({ email, type }) => {
      const { subject, htmlBody } =
        type === EmailType.PayEvent ? paymentReceivedEmail : paymentReceiptEmail
      return {
        From: 'noreply@juicebox.money',
        To: email,
        Subject: subject,
        HtmlBody: htmlBody,
        MessageStream: 'broadcast',
      }
    }),
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
  const usersResult = await sudoPublicDbClient
    .from('users')
    .select(
      `
      email,
      wallet,
      user_subscriptions (
        project_id,
        notification_id
      )
    `,
    )
    .eq('email_verified', true)
    .not('email', 'is', null)
  if (usersResult.error) throw usersResult.error

  // Filter out users that are not subscribed to the project or are the payer.
  const users = usersResult.data.filter(
    ({ wallet, user_subscriptions: subscriptions }) => {
      if (wallet === payer) return true
      if (Array.isArray(subscriptions)) {
        return subscriptions.some(
          s =>
            s.project_id === projectId &&
            s.notification_id === ProjectNotification.ProjectPaid,
        )
      }
      return (
        subscriptions?.project_id === projectId &&
        subscriptions?.notification_id === ProjectNotification.ProjectPaid
      )
    },
  )

  return users.map(u => {
    return {
      email: u.email as string,
      type: u.wallet === payer ? EmailType.PayReceipt : EmailType.PayEvent,
    }
  })
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST' || !JUICE_API_EVENTS_ENABLED) {
      return res.status(404).json({ message: 'Not found.' })
    }
    if (!authCheck(req, res)) return

    const event = await Schema.validate(req.body)

    const emailMetadata = await compileEmailMetadata(event)

    const emailEvents = await findEmailEventsForProjectId(
      Number(event.data.projectId),
      event.data.payer.toLowerCase(),
    )

    await sendEmails(emailMetadata, emailEvents)

    return res.status(200).json('Success!')
  } catch (e) {
    logger.error({ error: e })
    return res
      .status(500)
      .json({ message: 'Unexpected server error occurred.' })
  }
}
