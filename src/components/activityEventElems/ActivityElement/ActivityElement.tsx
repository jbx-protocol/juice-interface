import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

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

function Header({ header }: { header: string }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div style={smallHeaderStyle(colors)}>
      <Trans>{header}</Trans>
    </div>
  )
}

function SideDetails({ event }: { event: ActivityElementEvent }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div style={{ textAlign: 'right' }}>
      {event.timestamp && (
        <div style={smallHeaderStyle(colors)}>
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

export function ActivityEvent({
  header,
  subject,
  event,
  extra,
}: {
  header: string
  subject: string | JSX.Element | null
  extra?: string | JSX.Element | null
  event: ActivityElementEvent
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
