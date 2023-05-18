import { t, Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'
import RichNote from 'components/RichNote'
import { BigNumber } from 'ethers'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'

import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { ProjectEventsQuery } from 'generated/graphql'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useContext } from 'react'
import { ActivityEvent } from '../ActivityElement'

export default function ConfigureEventElem({
  event,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['configureEvent']
}) {
  if (!event) return null

  const { primaryETHTerminal } = useContext(V2V3ProjectContext)

  const { data: distributionLimit } = useProjectDistributionLimit({
    projectId: event.projectId,
    terminal: primaryETHTerminal,
    configuration: event.configuration?.toString(),
  })

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
    pausePay: event.pausePay,
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
      header={t`Edited cycle`}
      subject={
        <MinimalCollapse
          header={
            <span className="font-normal">
              <Trans>Details</Trans>
            </span>
          }
        >
          <FundingCycleDetails
            fundingCycle={fundingCycle as V2V3FundingCycle}
            fundingCycleMetadata={
              fundingCycleMetadata as V2V3FundingCycleMetadata
            }
            distributionLimit={distributionLimit?.[0]}
            distributionLimitCurrency={distributionLimit?.[1]}
            mintRateZeroAsUnchanged
          />
          {event.memo ? <RichNote className="mt-3" note={event.memo} /> : null}
        </MinimalCollapse>
      }
    />
  )
}
