import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectCreateEvent } from 'models/subgraph-entities/vX/project-create-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

import { Trans } from '@lingui/macro'

import { contentLineHeight, smallHeaderStyle } from './styles'

export default function ProjectCreateEventElem({
  event,
}: {
  event: Pick<ProjectCreateEvent, 'id' | 'caller' | 'timestamp' | 'txHash'>
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'space-between',
      }}
    >
      <div>
        <div style={smallHeaderStyle(colors)}>Created</div>
        <div
          style={{
            lineHeight: contentLineHeight,
          }}
        >
          <Trans>Project created by</Trans>{' '}
          <FormattedAddress
            address={event.caller}
            style={{ fontWeight: 400 }}
          />
        </div>
      </div>

      <div style={{ textAlign: 'right' }}>
        {event.timestamp && (
          <div style={smallHeaderStyle(colors)}>
            {formatHistoricalDate(event.timestamp * 1000)}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
        )}
      </div>
    </div>
  )
}
