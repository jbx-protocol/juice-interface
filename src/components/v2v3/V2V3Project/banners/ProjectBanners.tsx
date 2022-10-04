import { Space } from 'antd'
import { CV_V2 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useProjectQueuedFundingCycle from 'hooks/v2v3/contractReader/ProjectQueuedFundingCycle'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { RelaunchFundingCycleBanner } from './RelaunchFundingCycleBanner'
import { V2BugNoticeBanner } from './V2BugNoticeBanner'

export function ProjectBanners() {
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const { isPreviewMode, fundingCycle } = useContext(V2V3ProjectContext)

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)

  // If a V2 project has no current or queued FC, we assume that
  // it's because it's using the old bugged contracts.
  // TODO probably should check the contract address instead.
  const showV2BugNoticeBanner =
    !isPreviewMode &&
    cv === CV_V2 &&
    hasCurrentFundingCycle === false &&
    hasQueuedFundingCycle === false

  const showRelaunchFundingCycleBanner =
    showV2BugNoticeBanner && canReconfigureFundingCycles

  const hasBanners = showV2BugNoticeBanner || showRelaunchFundingCycleBanner

  if (!hasBanners) return null

  return (
    <Space direction="vertical" size="small" style={{ width: '100%' }}>
      {showV2BugNoticeBanner && <V2BugNoticeBanner />}
      {showRelaunchFundingCycleBanner && <RelaunchFundingCycleBanner />}
    </Space>
  )
}
