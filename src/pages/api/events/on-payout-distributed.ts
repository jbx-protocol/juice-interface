import { BigNumber, utils } from 'ethers'
import {
  DistributePayoutsEventsDocument,
  DistributePayoutsEventsQuery,
  ProjectsDocument,
  ProjectsQuery,
  QueryDistributePayoutsEventsArgs,
  QueryProjectsArgs,
} from 'generated/graphql'
import { emailServerClient } from 'lib/api/postmark'
import { sudoPublicDbClient } from 'lib/api/supabase/clients'
import { client } from 'lib/apollo/client'
import { authCheck } from 'lib/auth'
import { resolveAddressEnsIdeas } from 'lib/ensIdeas'
import { getLogger } from 'lib/logger'
import { ProjectNotification } from 'models/notifications/projectNotifications'
import moment from 'moment'
import { NextApiRequest, NextApiResponse } from 'next'
import { distributePayoutEmailTemplate } from 'templates/email/payments'
import { truncateEthAddress } from 'utils/format/formatAddress'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { fromWad } from 'utils/format/formatNumber'
import { getProjectMetadata } from 'utils/server/metadata'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import * as Yup from 'yup'

const JUICE_API_EVENTS_ENABLED = process.env.JUICE_API_EVENTS_ENABLED === 'true'

const logger = getLogger('api/events/on-payout-distributed')

type EmailEvent = {
  email: string
}

type EmailMetadata = {
  amount: string
  payerName: string
  payerEthscanUrl: string
  timestamp: string
  projectUrl: string
  projectName: string
  recipients: {
    name: string
    amount: string
    href: string
  }[]
  // Used in transaction receipt
  transactionUrl: string | undefined
  // Used in transaction receipt
  transactionName: string | undefined
}

const Schema = Yup.object().shape({
  // NOTE: We don't actually use these as the information comes from txHash and subgraph

  // data: Yup.object().shape({
  //   beneficiary: Yup.string().required(),
  //   amount: BigIntValidator('amount must be a BigInt').required(),
  //   distributedAmount: BigIntValidator(
  //     'distributedAmount must be a BigInt',
  //   ).required(),
  //   fee: BigIntValidator('fee must be a BigInt').required(),
  //   beneficiaryDistributionAmount: Yup.string().required(),
  //   caller: Yup.string().required(),
  //   metadata: Yup.string().required(),
  // }),
  metadata: Yup.object().shape({
    transactionHash: Yup.string().required(),
    // TODO add more fields if needed
  }),
})

// TODO: Get project image or address ens image
const splitDistributionToRecipient = async ({
  beneficiary,
  splitProjectId,
  amount,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  beneficiary: any
  splitProjectId: number
  amount: BigNumber
}) => {
  let recipientName = '??'
  let href = '#'
  if (splitProjectId) {
    const project = await queryProject(splitProjectId)
    if (project) {
      recipientName = project.handle
        ? `@${project.handle}`
        : `Project ID: ${splitProjectId}`
      href = `https://juicebox.money/v2/p/${splitProjectId}`
    }
  } else {
    const normalizedRecipientAddress = utils.getAddress(beneficiary)
    const { name: recipientEnsName } = await resolveAddressEnsIdeas(
      normalizedRecipientAddress,
    )
    recipientName =
      recipientEnsName ??
      truncateEthAddress({ address: normalizedRecipientAddress })
    href = `https://juicebox.money/account/${normalizedRecipientAddress}`
  }
  const am = fromWad(amount.toString())
  const formattedAmount = formatCurrencyAmount({
    amount: am,
    currency: V2V3_CURRENCY_ETH,
  })!
  return {
    name: recipientName,
    amount: formattedAmount,
    href,
  }
}

const compileEmailMetadata = async ({
  transactionHash,
  distributedAmount,
  from,
  projectId,
  splitDistributions,
}: DistributePayoutsEventsQuery['distributePayoutsEvents'][0] & {
  transactionHash: string
}): Promise<EmailMetadata> => {
  // TODO: Support USD?
  const amount = fromWad(distributedAmount.toString())
  const formattedAmount = formatCurrencyAmount({
    amount,
    currency: V2V3_CURRENCY_ETH,
  })!
  const normalizedPayerAddress = utils.getAddress(from)
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
    logger.error('failed to get project name', {
      projectId: projectId.toString(),
      e,
    })
  }

  const recipients = await Promise.all(
    splitDistributions.map(splitDistributionToRecipient),
  )

  const transactionName = transactionHash
  const transactionUrl = `https://etherscan.io/tx/${transactionHash}`

  return {
    amount: formattedAmount,
    payerName,
    payerEthscanUrl,
    timestamp: formattedTimestamp,
    projectUrl,
    projectName,
    recipients,
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
    recipients: metadata.recipients,
  }
  const distributePayoutsEmail = distributePayoutEmailTemplate(templateData)

  const res = await emailServerClient().sendEmailBatch(
    emailEvents.map(({ email }) => {
      const { subject, htmlBody } = distributePayoutsEmail
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
    message: 'broadcasted payout-distributed email',
    messageIds: res.map(r => r.MessageID),
  })
}

const findEmailEventsForProjectId = async (
  projectId: number,
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
    ({ user_subscriptions: subscriptions }) => {
      if (Array.isArray(subscriptions)) {
        return subscriptions.some(
          s =>
            s.project_id === projectId &&
            s.notification_id === ProjectNotification.PayoutsDistributed,
        )
      }
      return (
        subscriptions?.project_id === projectId &&
        subscriptions?.notification_id ===
          ProjectNotification.PayoutsDistributed
      )
    },
  )

  return users.map(u => {
    return {
      email: u.email as string,
    }
  })
}

const queryProject = async (projectId: number) => {
  const { data } = await client.query<ProjectsQuery, QueryProjectsArgs>({
    query: ProjectsDocument,
    variables: {
      where: {
        projectId: projectId,
        pv: '2',
      },
    },
  })
  if (data.projects.length === 0) return undefined
  return data.projects[0]
}

const queryDistributePayoutEvent = async (transactionHash: string) => {
  const { data } = await client.query<
    DistributePayoutsEventsQuery,
    QueryDistributePayoutsEventsArgs
  >({
    query: DistributePayoutsEventsDocument,
    variables: {
      where: {
        txHash: transactionHash,
      },
    },
  })
  return data.distributePayoutsEvents
}

export const config = {
  maxDuration: 300,
}
const MAX_RETRIES = 3 as const
const MAX_RETRY_TIME = 60_000 as const

export default async (req: NextApiRequest, res: NextApiResponse) => {
  let respondedToClient = false
  try {
    if (req.method !== 'POST' || !JUICE_API_EVENTS_ENABLED) {
      return res.status(404).json({ message: 'Not found.' })
    }
    if (!authCheck(req, res)) return

    const requestData = await Schema.validate(req.body)

    // Immediately respond to the request
    res.status(200).json({ message: 'Received.' })
    res.end()
    respondedToClient = true

    let event
    let retries = 0
    while (retries < MAX_RETRIES) {
      const events = await queryDistributePayoutEvent(
        requestData.metadata.transactionHash,
      )
      if (events.length > 0) {
        event = events[0]
        break
      }
      retries += 1
      if (retries < MAX_RETRIES) {
        logger.warn(`Retrying to find pay event - {${retries} / ${MAX_RETRIES}`)
        await new Promise(resolve =>
          setTimeout(resolve, MAX_RETRY_TIME / MAX_RETRIES),
        )
      }
    }
    if (!event) {
      logger.error('Failed to find distributed pay event')
      return
    }

    const emailMetadata = await compileEmailMetadata({
      transactionHash: requestData.metadata.transactionHash,
      ...event,
    })

    const emailEvents = await findEmailEventsForProjectId(
      Number(event.projectId),
    )
    logger.info({
      message: 'Found email events for project',
      projectId: event.projectId,
      emailEvents,
    })

    await sendEmails(emailMetadata, emailEvents)
    logger.info({
      message: 'Successfully sent payout distribution emails',
      projectId: event.projectId,
    })
  } catch (e) {
    logger.error({ error: e })
    if (respondedToClient) return
    return res
      .status(500)
      .json({ message: 'Unexpected server error occurred.' })
  }
}
