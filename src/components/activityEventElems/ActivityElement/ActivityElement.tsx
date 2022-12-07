import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ProjectVersionBadge } from 'components/ProjectVersionBadge'
import { ThemeContext } from 'contexts/themeContext'
import { useV2V3TerminalVersion } from 'hooks/V2V3TerminalVersion'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/format/formatDate'
import { contentLineHeight, smallHeaderStyle } from '../styles'

import { ActivityElementEvent } from './activityElementEvent'

const DetailsContainer: React.FC = ({ children }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'space-between',
      }}
    >
      {children}
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

function SideDetails({ event }: { event: ActivityElementEvent }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const terminalVersion = useV2V3TerminalVersion(event.terminal)

  return (
    <div style={{ textAlign: 'right' }}>
      {event.timestamp && (
        <div className="text-xs text-grey-500 dark:text-grey-300">
          {formatHistoricalDate(event.timestamp * 1000)}{' '}
          {terminalVersion && (
            <ProjectVersionBadge
              versionText={'V' + terminalVersion}
              style={{
                ...smallHeaderStyle(colors),
                color: colors.text.secondary,
              }}
            />
          )}{' '}
          <EtherscanLink value={event.txHash} type="tx" />
        </div>
      )}
      {event.beneficiary ? (
        <div
          style={{
            lineHeight: contentLineHeight,
          }}
          className="text-sm text-grey-500 dark:text-grey-300"
        >
          <FormattedAddress address={event.beneficiary} />
        </div>
      ) : null}
    </div>
  )
}

function Subject({ subject }: { subject: string | JSX.Element | null }) {
  return (
    <div
      style={{
        lineHeight: contentLineHeight,
      }}
      className="text-sm"
    >
      {subject}
    </div>
  )
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
      <DetailsContainer>
        <div>
          <Header header={header} />
          <Subject subject={subject} />
        </div>
        <SideDetails event={event} />
      </DetailsContainer>
      {extra ? <ExtraContainer>{extra}</ExtraContainer> : null}
    </>
  )
}
