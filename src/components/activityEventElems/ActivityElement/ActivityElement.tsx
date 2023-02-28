import { ArrowRightOutlined } from '@ant-design/icons'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useV2V3TerminalVersion } from 'hooks/v2v3/V2V3TerminalVersion'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { smallHeaderStyle } from '../styles'

import { ActivityElementEvent } from './activityElementEvent'

const CallerBeneficiary = ({
  caller,
  beneficiary,
}: {
  caller?: string
  beneficiary?: string
}) => {
  if (!beneficiary && !caller) return null

  return beneficiary && caller && !isEqualAddress(beneficiary, caller) ? (
    <div className="text-xs text-grey-500 dark:text-grey-300">
      <FormattedAddress withEnsAvatar address={caller} title="Caller" />{' '}
      <ArrowRightOutlined />{' '}
      <FormattedAddress
        withEnsAvatar
        address={beneficiary}
        title="Beneficiary"
      />
    </div>
  ) : (
    <div className="text-sm text-grey-500 dark:text-grey-300">
      <FormattedAddress withEnsAvatar address={beneficiary} />
    </div>
  )
}

const ExtraContainer: React.FC = ({ children }) => {
  return (
    <div
      style={{
        marginTop: '5px',
      }}
    >
      {children}
    </div>
  )
}

function Header({ header }: { header: string | JSX.Element }) {
  return (
    <div className="text-xs capitalize text-grey-500 dark:text-grey-300">
      {header}
    </div>
  )
}

function TimestampVersion({
  timestamp,
  txHash,
  terminal,
}: ActivityElementEvent) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const terminalVersion = useV2V3TerminalVersion(terminal)

  return (
    <div style={{ textAlign: 'right' }}>
      {timestamp && (
        <div className="text-xs text-grey-500 dark:text-grey-300">
          {formatHistoricalDate(timestamp * 1000)}{' '}
          {terminalVersion && (
            <ProjectVersionBadge
              versionText={'V' + terminalVersion}
              style={{
                ...smallHeaderStyle(colors),
                color: colors.text.secondary,
              }}
            />
          )}{' '}
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

        <div className="mt-1 flex items-center justify-between">
          <Subject subject={subject} />
          <CallerBeneficiary {...event} />
        </div>
      </div>

      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </>
  )
}
