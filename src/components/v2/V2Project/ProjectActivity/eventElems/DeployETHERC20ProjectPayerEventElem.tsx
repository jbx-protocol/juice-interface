import { Trans } from '@lingui/macro'
import { smallHeaderStyle } from 'components/activityEventElems/styles'
import EtherscanLink from 'components/EtherscanLink'
import FormattedAddress from 'components/FormattedAddress'
import RichNote from 'components/RichNote'
import { ThemeContext } from 'contexts/themeContext'
import { DeployETHERC20ProjectPayerEvent } from 'models/subgraph-entities/v2/deploy-eth-erc20-project-payer-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'

export default function DeployETHERC20ProjectPayerEventElem({
  event,
}: {
  event:
    | Pick<
        DeployETHERC20ProjectPayerEvent,
        'id' | 'timestamp' | 'txHash' | 'caller' | 'address' | 'memo'
      >
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!event) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <div style={smallHeaderStyle(colors)} className="text-xs">
          <Trans>Created Payment Address</Trans>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={smallHeaderStyle(colors)} className="text-xs">
            {event.timestamp && (
              <span>{formatHistoricalDate(event.timestamp * 1000)}</span>
            )}{' '}
            <EtherscanLink value={event.txHash} type="tx" />
          </div>
          <div style={smallHeaderStyle(colors)} className="text-xs">
            <Trans>
              called by <FormattedAddress address={event.caller} />
            </Trans>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 5 }}>
        <Trans>
          Address: <FormattedAddress address={event.address} />
        </Trans>
      </div>

      {event.memo && (
        <div style={{ marginTop: 5 }}>
          <RichNote note={event.memo} />
        </div>
      )}
    </div>
  )
}
