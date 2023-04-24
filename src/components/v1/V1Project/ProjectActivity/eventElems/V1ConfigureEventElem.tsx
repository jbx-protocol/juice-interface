import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import MinimalTable from 'components/MinimalTable'
import { SECONDS_IN_DAY } from 'constants/numbers'
import { V1_CURRENCY_ETH } from 'constants/v1/currency'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { V1ConfigureEvent } from 'models/subgraph-entities/v1/v1-configure'
import { useContext } from 'react'
import {
  formatWad,
  perbicentToPercent,
  permilleToPercent,
} from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'

export default function V1ConfigureEventElem({
  event,
}: {
  event:
    | Pick<
        V1ConfigureEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'from'
        | 'ballot'
        | 'discountRate'
        | 'duration'
        | 'target'
        | 'bondingCurveRate'
        | 'reservedRate'
        | 'currency'
        | 'payIsPaused'
        | 'ticketPrintingIsAllowed'
      >
    | undefined
}) {
  const { terminal } = useContext(V1ProjectContext)

  if (!event) return null

  function BallotStrategyElem(ballot: string) {
    const strategy = getBallotStrategyByAddress(ballot)
    if (strategy.unknown) return <FormattedAddress address={ballot} />
    else return strategy.name
  }

  return (
    <ActivityEvent
      event={event}
      header={t`Edited cycle`}
      subject={null}
      extra={
        <MinimalTable
          sections={[
            [
              {
                key: t`Duration`,
                value: detailedTimeString({
                  timeSeconds: event.duration * SECONDS_IN_DAY,
                  fullWords: true,
                }),
              },
              {
                key: t`Payouts`,
                value: (
                  <span>
                    <CurrencySymbol
                      currency={
                        event.currency === V1_CURRENCY_ETH ? 'ETH' : 'USD'
                      }
                    />
                    {formatWad(event.target, {
                      precision: event.currency === V1_CURRENCY_ETH ? 4 : 2,
                      padEnd: true,
                    })}
                  </span>
                ),
              },
            ],
            [
              {
                key: t`Reserved rate`,
                value: perbicentToPercent(event.reservedRate) + '%',
              },
              {
                key: t`Redemption rate`,
                value: perbicentToPercent(event.bondingCurveRate) + '%',
              },
              {
                key: t`Issuance reduction rate`,
                value: permilleToPercent(event.discountRate) + '%',
              },
            ],
            [
              {
                key: t`Edit deadline`,
                value: BallotStrategyElem(event.ballot),
              },
            ],
            ...(terminal?.version === '1.1'
              ? [
                  [
                    {
                      key: t`Owner token minting`,
                      value: event.ticketPrintingIsAllowed,
                    },
                    {
                      key: t`Payments to this project paused`,
                      value: event.payIsPaused,
                    },
                  ],
                ]
              : []),
          ]}
        />
      }
    />
  )
}
