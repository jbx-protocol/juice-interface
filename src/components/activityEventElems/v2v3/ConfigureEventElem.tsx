import { t, Trans } from '@lingui/macro'
import { MinimalCollapse } from 'components/MinimalCollapse'
import RichNote from 'components/RichNote/RichNote'
import { BigNumber } from 'ethers'
import { V2V3FundingCycle } from 'models/v2v3/fundingCycle'

import FundingCycleDetails from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/FundingCycleDetails'
import { PV_V2 } from 'constants/pv'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { ProjectEventsQuery } from 'generated/graphql'
import useProjectDistributionLimit from 'hooks/v2v3/contractReader/useProjectDistributionLimit'
import { useContext } from 'react'
import { sgFCToV2V3FundingCycleMetadata } from 'utils/v2v3/fundingCycle'
import { ActivityEvent } from '../ActivityElement/ActivityElement'

export default function ConfigureEventElem({
  event,
  withProjectLink,
}: {
  event: ProjectEventsQuery['projectEvents'][0]['configureEvent']
  withProjectLink?: boolean
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

  const fundingCycleMetadata =
    event.fundingCycle && sgFCToV2V3FundingCycleMetadata(event.fundingCycle)

  return (
    <ActivityEvent
      event={event}
      header={t`Edited cycle`}
      withProjectLink={withProjectLink}
      pv={PV_V2}
      subject={
        <MinimalCollapse
          header={
            <span className="font-normal">
              <Trans>Details</Trans>
            </span>
          }
        >
          {fundingCycle && fundingCycleMetadata ? (
            <FundingCycleDetails
              fundingCycle={fundingCycle as V2V3FundingCycle}
              fundingCycleMetadata={fundingCycleMetadata}
              distributionLimit={distributionLimit?.[0]}
              distributionLimitCurrency={distributionLimit?.[1]}
              mintRateZeroAsUnchanged
            />
          ) : (
            <div>No data</div>
          )}
          {event.memo ? <RichNote className="mt-3" note={event.memo} /> : null}
        </MinimalCollapse>
      }
    />
  )
}
