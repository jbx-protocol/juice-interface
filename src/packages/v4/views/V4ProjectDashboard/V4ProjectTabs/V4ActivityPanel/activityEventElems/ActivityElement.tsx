import { Tooltip } from 'antd'
import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import { PV } from 'models/pv'
import { formatHistoricalDate } from 'utils/format/formatDate'

export interface ActivityElementEvent {
  timestamp: number
  txHash: string
  from: string
  beneficiary?: string
  terminal?: string
  projectId?: number
  project?: {
    handle?: string | null
  }
  pv?: PV
}

const FromBeneficiary = ({
  from,
  beneficiary,
  distributionFromProjectId,
}: {
  from?: string
  beneficiary?: string
  distributionFromProjectId?: number // projectId only defined for v2 events
}) => {
  if (!(beneficiary || from || distributionFromProjectId)) return null

  return (
    <Tooltip
      trigger={['hover', 'click']}
      title={
        <div>
          <div>
            Called by: <JuiceboxAccountLink address={from} />
          </div>
          {beneficiary && (
            <div>
              Beneficiary: <JuiceboxAccountLink address={beneficiary} />
            </div>
          )}
          {/* {distributionFromProjectId && (
            <div className="flex items-baseline gap-1">
              Paid from:{' '}
              <V4ProjectHandleLink 
                projectId={distributionFromProjectId}
                className="leading-5 dark:text-grey-900"
              />
            </div>
          )} */}
        </div>
      }
    >
      <div>
        {/* {distributionFromProjectId ? (
          <V4ProjectHandleLink
            projectId={distributionFromProjectId}
            className="leading-3 dark:text-grey-100"
            containerClassName="gap-2"
            withProjectAvatar
          />
        ) : (
          <EthereumAddress address={from} tooltipDisabled linkDisabled />
        )} */}
        <EthereumAddress address={from} tooltipDisabled linkDisabled />
      </div>
    </Tooltip>
  )
}

const ExtraContainer: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <div className="mt-2">{children}</div>
}

function Header({
  header,
  projectId,
  handle,
  pv,
}: {
  header: string | JSX.Element
  projectId?: number
  handle?: string | null
  pv?: PV
}) {
  const withProjectLink = projectId && pv

  return (
    <div className="text-xs capitalize text-grey-500 dark:text-grey-300">
      {header}
      {/* {withProjectLink && (
        <span className="ml-1">
          <V4ProjectHandleLink /...
        </span>
      )} */}
    </div>
  )
}

function TimestampVersion({ timestamp, txHash }: ActivityElementEvent) {
  return (
    <div className="text-right">
      {timestamp && (
        <div className="text-xs text-grey-500 dark:text-grey-300">
          {formatHistoricalDate(timestamp * 1000)}{' '}
          <EtherscanLink
            value={txHash}
            type="tx"
            className="text-grey-500 dark:text-grey-300"
          />
        </div>
      )}
    </div>
  )
}

function Subject({ subject }: { subject: string | JSX.Element | null }) {
  return <div className="text-sm">{subject}</div>
}

/**
 *
 * @param header Text that concisely labels the event
 * @param subject The primary information from a specific event
 * @param event Project activity event object
 * @param extra Optional content added beneath the subject
 */
export function ActivityEvent({
  header,
  subject,
  extra,
  event,
  withProjectLink,
  pv,
}: {
  header: string | JSX.Element
  subject: string | JSX.Element | null
  event: ActivityElementEvent | null | undefined
  extra?: string | JSX.Element | null
  withProjectLink?: boolean
  pv?: PV
}) {
  if (!event) return null

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Header
            header={header}
            projectId={withProjectLink ? event.projectId : undefined}
            pv={withProjectLink ? event.pv || pv : undefined}
            handle={withProjectLink ? event.project?.handle : undefined}
          />
          <TimestampVersion {...event} />
        </div>

        <div className="mt-1 flex items-center justify-between">
          <Subject subject={subject} />
          <FromBeneficiary {...event} />
        </div>
      </div>

      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </>
  )
}
