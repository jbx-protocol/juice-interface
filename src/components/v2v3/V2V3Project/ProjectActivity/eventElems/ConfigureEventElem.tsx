import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { ActivityEvent } from 'components/activityEventElems/ActivityElement'
import { MinimalCollapse } from 'components/MinimalCollapse'
import { ConfigureEvent } from 'models/subgraph-entities/v2/configure'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import FundingCycleDetails from '../../V2V3FundingCycleSection/FundingCycleDetails'

export default function ConfigureEventElem({
  event,
}: {
  event:
    | Pick<
        ConfigureEvent,
        | 'id'
        | 'timestamp'
        | 'mustStartAtOrAfter'
        | 'txHash'
        | 'caller'
        | 'ballot'
        | 'dataSource'
        | 'discountRate'
        | 'duration'
        | 'mintingAllowed'
        | 'payPaused'
        | 'redeemPaused'
        | 'burnPaused'
        | 'transfersPaused'
        | 'distributionsPaused'
        | 'redemptionRate'
        | 'ballotRedemptionRate'
        | 'reservedRate'
        | 'weight'
        | 'shouldHoldFees'
        | 'setTerminalsAllowed'
        | 'setControllerAllowed'
        | 'controllerMigrationAllowed'
        | 'terminalMigrationAllowed'
        | 'transfersPaused'
        | 'useDataSourceForPay'
        | 'useDataSourceForRedeem'
        | 'useTotalOverflowForRedemptions'
      >
    | undefined
}) {
  if (!event) return null

  const fundingCycle: Partial<V2V3FundingCycle> = {
    duration: BigNumber.from(event.duration),
    weight: BigNumber.from(event.weight),
    discountRate: BigNumber.from(event.discountRate),
    ballot: event.ballot,
    start: event.mustStartAtOrAfter
      ? BigNumber.from(event.mustStartAtOrAfter)
      : undefined,
  }

  const fundingCycleMetadata: Partial<V2V3FundingCycleMetadata> = {
    reservedRate: BigNumber.from(event.reservedRate),
    redemptionRate: BigNumber.from(event.redemptionRate),
    global: {
      pauseTransfers: event.transfersPaused,
      allowSetController: event.setControllerAllowed,
      allowSetTerminals: event.setTerminalsAllowed,
    },
    allowControllerMigration: event.controllerMigrationAllowed,
    allowTerminalMigration: event.terminalMigrationAllowed,
    pausePay: event.payPaused,
    pauseRedeem: event.redeemPaused,
    pauseBurn: event.burnPaused,
    pauseDistributions: event.distributionsPaused,
    useTotalOverflowForRedemptions: event.useTotalOverflowForRedemptions,
    holdFees: event.shouldHoldFees,
    dataSource: event.dataSource,
    useDataSourceForPay: event.useDataSourceForPay,
    useDataSourceForRedeem: event.useDataSourceForRedeem,
    allowMinting: event.mintingAllowed,
  }

  return (
    <ActivityEvent
      event={event}
      header={t`Configured funding cycles`}
      subject={null}
      extra={
        <MinimalCollapse header={t`Funding cycle details`}>
          <FundingCycleDetails
            fundingCycle={fundingCycle as V2V3FundingCycle}
            fundingCycleMetadata={
              fundingCycleMetadata as V2V3FundingCycleMetadata
            }
            distributionLimit={undefined}
            distributionLimitCurrency={undefined}
            mintRateZeroAsUnchanged
          />
        </MinimalCollapse>
      }
    />
  )
}
