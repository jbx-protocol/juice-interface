import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import FormattedAddress from 'components/FormattedAddress'
import MinimalTable from 'components/MinimalTable'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { ConfigureEvent } from 'models/subgraph-entities/v2/configure'
import { useContext } from 'react'
import {
  formatAllowed,
  formatEnabled,
  formatPaused,
} from 'utils/format/formatBoolean'
import { formatWad } from 'utils/format/formatNumber'
import { detailedTimeString } from 'utils/format/formatTime'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'

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
        | 'setTerminalsAllowed'
        | 'setControllerAllowed'
        | 'controllerMigrationAllowed'
        | 'terminalMigrationAllowed'
        | 'transfersPaused'
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
                  : t`Unchanged`,
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
                value: formatPaused(event.payPaused),
              },
              {
                key: t`Redemptions`,
                value: formatPaused(event.redeemPaused),
              },
              {
                key: t`Owner token minting`,
                value: formatEnabled(event.mintingAllowed),
              },
              {
                key: t`Token transfers`,
                value: formatPaused(event.transfersPaused),
              },
              {
                key: t`Payment Terminal configuration`,
                value: formatAllowed(event.setTerminalsAllowed),
              },
              {
                key: t`Controller configuration`,
                value: formatAllowed(event.setControllerAllowed),
              },
              {
                key: t`Payment Terminal migration`,
                value: formatAllowed(event.terminalMigrationAllowed),
              },
              {
                key: t`Controller migration`,
                value: formatAllowed(event.controllerMigrationAllowed),
              },
            ],
          ]}
        />
      }
    />
  )
}
