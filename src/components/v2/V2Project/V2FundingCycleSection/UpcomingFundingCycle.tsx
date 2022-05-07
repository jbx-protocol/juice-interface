import { CardSection } from 'components/shared/CardSection'
import FundingCycleDetailsCard from 'components/shared/Project/FundingCycleDetailsCard'
import { LoadingOutlined } from '@ant-design/icons'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext } from 'react'
import { V2FundingCycleRiskCount } from 'utils/v2/fundingCycle'

import useProjectDistributionLimit from 'hooks/v2/contractReader/ProjectDistributionLimit'

import useProjectSplits from 'hooks/v2/contractReader/ProjectSplits'

import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'

import FundingCycleDetails from './FundingCycleDetails'
import PayoutSplitsCard from './PayoutSplitsCard'
import ReservedTokensSplitsCard from './ReservedTokensSplitsCard'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/v2/splits'

export default function UpcomingFundingCycle({
  expandCard,
}: {
  expandCard?: boolean
}) {
  const { projectId, primaryTerminal } = useContext(V2ProjectContext)

  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle, queuedFundingCycleMetadata] =
    queuedFundingCycleResponse || []

  const { data: queuedPayoutSplits } = useProjectSplits({
    projectId,
    splitGroup: ETH_PAYOUT_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedReservedTokensSplits } = useProjectSplits({
    projectId,
    splitGroup: RESERVED_TOKEN_SPLIT_GROUP,
    domain: queuedFundingCycle?.configuration?.toString(),
  })

  const { data: queuedDistributionLimitData } = useProjectDistributionLimit({
    projectId,
    configuration: queuedFundingCycle?.configuration.toString(),
    terminal: primaryTerminal,
  })
  const [queuedDistributionLimit, queuedDistributionLimitCurrency] =
    queuedDistributionLimitData ?? []

  if (queuedFundingCycleLoading || !queuedFundingCycle)
    return <LoadingOutlined />

  const queuedReservedRate = queuedFundingCycleMetadata?.reservedRate

  return (
    <div>
      <CardSection>
        <FundingCycleDetailsCard
          fundingCycleNumber={queuedFundingCycle.number}
          fundingCycleDetails={
            <FundingCycleDetails
              fundingCycle={queuedFundingCycle}
              distributionLimit={queuedDistributionLimit}
              distributionLimitCurrency={queuedDistributionLimitCurrency}
            />
          }
          fundingCycleDurationSeconds={queuedFundingCycle.duration}
          fundingCycleStartTime={queuedFundingCycle.start}
          isFundingCycleRecurring
          fundingCycleRiskCount={V2FundingCycleRiskCount(queuedFundingCycle)}
          expand={expandCard}
        />
      </CardSection>

      <PayoutSplitsCard
        payoutSplits={queuedPayoutSplits}
        distributionLimitCurrency={queuedDistributionLimitCurrency}
        distributionLimit={queuedDistributionLimit}
        hideDistributeButton
      />
      <ReservedTokensSplitsCard
        reservedTokensSplits={queuedReservedTokensSplits}
        reservedRate={queuedReservedRate}
        hideDistributeButton
      />
    </div>
  )
}
