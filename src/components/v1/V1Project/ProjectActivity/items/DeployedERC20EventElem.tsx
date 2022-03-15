import EtherscanLink from 'components/shared/EtherscanLink'
import { ThemeContext } from 'contexts/themeContext'
import { DeployedERC20Event } from 'models/subgraph-entities/deployed-erc20-event'
import { useContext } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { contentLineHeight, smallHeaderStyle } from '../styles'

export default function DeployedERC20EventElem({
  event,
}: {
  event:
    | Pick<DeployedERC20Event, 'symbol' | 'id' | 'timestamp' | 'txHash'>
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!event) return null

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'space-between',
      }}
    >
      <div>
        <div style={smallHeaderStyle(colors)}>Deployed ERC20 token</div>
        <div
          style={{
            lineHeight: contentLineHeight,
            fontSize: '1rem',
          }}
        >
          {event.symbol}
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
