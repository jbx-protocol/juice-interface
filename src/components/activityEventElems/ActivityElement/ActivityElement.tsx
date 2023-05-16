import { ArrowRightOutlined } from '@ant-design/icons'
import EthereumAddress from 'components/EthereumAddress'
import EtherscanLink from 'components/EtherscanLink'
import { JuiceboxAccountLink } from 'components/JuiceboxAccountLink'
import V1ProjectHandle from 'components/v1/shared/V1ProjectHandle'
import V2V3ProjectHandleLink from 'components/v2v3/shared/V2V3ProjectHandleLink'
import { PV_V2 } from 'constants/pv'
import { PV } from 'models/pv'
import { isEqualAddress } from 'utils/address'
import { formatHistoricalDate } from 'utils/format/formatDate'

import { ActivityElementEvent } from './activityElementEvent'

const FromBeneficiary = ({
  from,
  beneficiary,
}: {
  from?: string
  beneficiary?: string
}) => {
  if (!(beneficiary || from)) return null

  return beneficiary && from && !isEqualAddress(beneficiary, from) ? (
    <div className="text-xs">
      <EthereumAddress address={from} /> <ArrowRightOutlined />{' '}
      <EthereumAddress address={beneficiary} />
    </div>
  ) : (
    <div className="text-sm">
      <JuiceboxAccountLink address={from} withEnsAvatar />
    </div>
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
      {withProjectLink && (
        <span className="ml-1">
          {pv === PV_V2 ? (
            <V2V3ProjectHandleLink
              projectId={projectId}
              className="text-grey-500 dark:text-grey-300"
            />
          ) : (
            <V1ProjectHandle
              projectId={projectId}
              handle={handle}
              className="text-grey-500 dark:text-grey-300"
            />
          )}
        </span>
      )}
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

        <div className="mt-1 flex items-start justify-between">
          <Subject subject={subject} />
          <FromBeneficiary {...event} />
        </div>
      </div>

      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </>
  )
}
