import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import FormattedAddress from 'components/FormattedAddress'
import MinimalTable from 'components/tables/MinimalTable'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { ConfigureEvent } from 'models/subgraph-entities/v2/configure'
import { useContext } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'

function booleanStatusText(status: boolean) {
  return status ? t`Enabled` : t`Disabled`
}

export default function ConfigureEventElem({
  event,
}: {
  event:
    | Pick<
        ConfigureEvent,
        | 'id'
        | 'timestamp'
        | 'txHash'
        | 'caller'
        | 'ballot'
        | 'dataSource'
        | 'discountRate'
        | 'duration'
        | 'mintingAllowed'
        | 'payPaused'
        | 'redeemPaused'
        | 'redemptionRate'
        | 'reservedRate'
        | 'weight'
        | 'shouldHoldFees'
      >
    | undefined
}) {
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  if (!event) return null

  function BallotStrategyElem(ballot: string) {
    const strategy = getBallotStrategyByAddress(ballot)
    if (strategy.unknown) return <FormattedAddress address={ballot} />
    else return strategy.name
  }

  return (
    <ActivityEvent
      event={event}
      header={t`Configured funding cycles`}
      subject={null}
      extra={
        <MinimalTable
          sections={[
            [
              {
                key: t`Duration`,
                value: detailedTimeString({
                  timeSeconds: event.duration,
                  fullWords: true,
                }),
              },
            ],
            [
              {
                key: t`Mint rate`,
                value: event.weight.gt(0)
                  ? `${formatWad(event.weight)} ${tokenSymbolText({
                      tokenSymbol,
                      plural: true,
                    })}/ETH`
                  : t`Mint rate unchanged`,
              },
              { key: t`Reserved rate`, value: event.reservedRate / 100 + '%' },
              {
                key: t`Redemption rate`,
                value: event.redemptionRate / 100 + '%',
              },
              {
                key: t`Discount rate`,
                value: event.discountRate / 10_000_000 + '%',
              },
            ],
            [
              {
                key: t`Reconfiguration strategy`,
                value: BallotStrategyElem(event.ballot),
              },
            ],
            [
              {
                key: t`Payments`,
                value: booleanStatusText(!event.payPaused),
              },
              {
                key: t`Redemptions`,
                value: booleanStatusText(!event.redeemPaused),
              },
              {
                key: t`Owner token minting`,
                value: booleanStatusText(event.mintingAllowed),
              },
              {
                key: t`Hold fees`,
                value: booleanStatusText(event.shouldHoldFees),
              },
            ],
          ]}
        />
      }
    />
  )
}
