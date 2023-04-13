import { ArrowRightOutlined } from '@ant-design/icons'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { isEqualAddress } from 'utils/address'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { ActivityElementEvent } from './activityElementEvent'

const CallerBeneficiary = ({
  caller,
  beneficiary,
}: {
  caller?: string
  beneficiary?: string
}) => {
  if (!(beneficiary || caller)) return null

  return beneficiary && caller && !isEqualAddress(beneficiary, caller) ? (
    <div className="text-xs text-grey-500 dark:text-grey-300">
      <FormattedAddress address={caller} title="Caller" />{' '}
      <ArrowRightOutlined />{' '}
      <FormattedAddress address={beneficiary} title="Beneficiary" />
    </div>
  ) : (
    <div className="text-sm text-grey-500 dark:text-grey-300">
      <FormattedAddress withEnsAvatar address={caller} />
    </div>
  )
}

const ExtraContainer: React.FC = ({ children }) => {
  return <div className="mt-2">{children}</div>
}

function Header({ header }: { header: string | JSX.Element }) {
  return (
    <div className="text-xs capitalize text-grey-500 dark:text-grey-300">
      {header}
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
}: {
  header: string | JSX.Element
  subject: string | JSX.Element | null
  event: ActivityElementEvent
  extra?: string | JSX.Element | null
}) {
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Header header={header} />
          <TimestampVersion {...event} />
        </div>

        <div className="mt-1 flex items-start justify-between">
          <Subject subject={subject} />
          <CallerBeneficiary {...event} />
        </div>
      </div>

      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </>
  )
}
