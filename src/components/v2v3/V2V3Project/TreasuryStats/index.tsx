import { Skeleton } from 'antd'
import FundingProgressBar from 'components/Project/FundingProgressBar'
import { VolumeStatLine } from 'components/Project/VolumeStatLine'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useTerminalCurrentOverflow from 'hooks/v2v3/contractReader/useTerminalCurrentOverflow'
import { useContext } from 'react'
import DistributedRatio from './DistributedRatio'
import OwnerBalance from './OwnerBalance'
import ProjectBalance from './ProjectBalance'

export default function TreasuryStats() {
  const {
    balanceInDistributionLimitCurrency,
    distributionLimit,
    totalVolume,
    primaryETHTerminal,
    loading: { distributionLimitLoading },
  } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const { data: overflow, loading: overflowLoading } =
    useTerminalCurrentOverflow({
      terminal: primaryETHTerminal,
      projectId,
    })

  const fundingProgressBarLoading = overflowLoading || distributionLimitLoading

  return (
    <div className="flex flex-col gap-2">
      <VolumeStatLine totalVolume={totalVolume} />
      <ProjectBalance />
      <DistributedRatio />
      <Skeleton
        loading={fundingProgressBarLoading}
        title={false}
        paragraph={{ rows: 1, width: ['100%'] }}
        active
      >
        {!fundingProgressBarLoading && distributionLimit ? (
          <FundingProgressBar
            targetAmount={distributionLimit}
            balanceInTargetCurrency={balanceInDistributionLimitCurrency}
            overflowAmountInTargetCurrency={overflow}
          />
        ) : null}
      </Skeleton>
      <OwnerBalance />
    </div>
  )
}
