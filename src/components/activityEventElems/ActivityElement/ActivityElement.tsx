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
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={{ ...smallHeaderStyle(colors), textTransform: 'capitalize' }}>
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
        <div style={smallHeaderStyle(colors)}>
          {terminalVersion && (
            <ProjectVersionBadge
              style={{ padding: 0, background: 'transparent' }}
              versionText={'V' + terminalVersion}
            />
          )}{' '}
          {formatHistoricalDate(event.timestamp * 1000)}{' '}
          <EtherscanLink value={event.txHash} type="tx" />
        </div>
      )}
      {event.beneficiary ? (
        <div
          style={{
            ...smallHeaderStyle(colors),
            lineHeight: contentLineHeight,
          }}
        >
          <FormattedAddress
            address={event.beneficiary}
            style={{ fontWeight: 400 }}
          />
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
