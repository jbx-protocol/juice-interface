import { BigNumber } from '@ethersproject/bignumber'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { ThemeContext } from 'contexts/themeContext'
import useEventListener from 'hooks/EventListener'
import { ContractName } from 'models/contract-name'
import { PayEvent } from 'models/events/pay-event'
import { CSSProperties, useContext } from 'react'
import { formatDate } from 'utils/formatDate'
import { formatWad, toUint256 } from 'utils/formatNumber'

export default function PayEvents({
  projectId,
}: {
  projectId: BigNumber | undefined
}) {
  const { colors } = useContext(ThemeContext).theme

  const events = useEventListener<PayEvent>({
    contractName: ContractName.TerminalV1,
    eventName: 'Pay',
    topics: projectId ? [undefined, toUint256(projectId)] : undefined,
    includeHistory: true,
  })

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    color: colors.text.tertiary,
  }

  const contentLineHeight = 1.5
  return (
    <div>
      {events?.length ? (
        events.map((event, i) => (
          <div
            style={{
              marginBottom: 20,
              paddingBottom: 20,
              borderBottom: '1px solid ' + colors.stroke.tertiary,
            }}
            key={i}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignContent: 'space-between',
              }}
            >
              <div>
                <div style={smallHeaderStyle}>Received</div>
                <div
                  style={{
                    lineHeight: contentLineHeight,
                    fontSize: '1rem',
                    marginRight: 10,
                    color: colors.text.primary,
                  }}
                >
                  <CurrencySymbol currency={0} />
                  {formatWad(event.amount)}
                </div>
              </div>

              <div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    textAlign: 'right',
                    color: colors.text.secondary,
                  }}
                >
                  {formatDate(event.timestamp * 1000)}
                </div>
                <div
                  style={{
                    ...smallHeaderStyle,
                    color: colors.text.secondary,
                    marginTop: '.3rem',
                    lineHeight: contentLineHeight,
                  }}
                >
                  {event.operator}
                </div>
              </div>
            </div>

            {event.note && (
              <div style={{ color: colors.text.secondary, marginTop: 5 }}>
                "{event.note}"
              </div>
            )}
          </div>
        ))
      ) : (
        <div
          style={{
            color: colors.text.secondary,
            paddingTop: 20,
            borderTop: '1px solid ' + colors.stroke.tertiary,
          }}
        >
          No activity yet
        </div>
      )}
    </div>
  )
}
