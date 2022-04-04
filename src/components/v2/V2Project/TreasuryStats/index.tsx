import { Skeleton, Space } from 'antd'
import FundingProgressBar from 'components/shared/Project/FundingProgressBar'
import { useContext } from 'react'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useProjectTerminalOverflow from 'hooks/v2/contractReader/ProjectTerminalOverflow'

import ProjectBalance from './ProjectBalance'
import DistributedRatio from './DistributedRatio'
import OwnerBalance from './OwnerBalance'

export default function TreasuryStats() {
  const {
    balanceInDistributionLimitCurrency,
    distributionLimit,
    terminals,
    projectId,
  } = useContext(V2ProjectContext)

  const { data: overflow, loading: overflowLoading } =
    useProjectTerminalOverflow({
      terminal: terminals?.[0],
      projectId,
    })

  const fundingProgressBarLoading = overflowLoading || !distributionLimit

  return (
    <Space direction="vertical" style={{ display: 'flex' }}>
      <ProjectBalance />
      <DistributedRatio />
      <Skeleton
        loading={fundingProgressBarLoading}
        title={false}
        paragraph={{ rows: 1, width: ['100%'] }}
        active
      >
        {!fundingProgressBarLoading ? (
          <FundingProgressBar
            targetAmount={distributionLimit}
            balanceInTargetCurrency={balanceInDistributionLimitCurrency}
            overflowAmountInTargetCurrency={overflow}
          />
        ) : null}
      </Skeleton>
      <OwnerBalance />
    </Space>
  )
}
