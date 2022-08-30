import { Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
// TODO: Do we still need lazy loading?

import { useContext, useState } from 'react'

import { useIsUserAddress } from 'hooks/IsUserAddress'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import { RelaunchFundingCycleBanner } from './banners/RelaunchFundingCycleBanner'
import V2ProjectHeaderActions from './V2ProjectHeaderActions'
import V2ProjectInfo from './V2ProjectInfo'

export default function V2Project() {
  const {
    projectId,
    projectMetadata,
    fundingCycle,
    isPreviewMode,
    isArchived,
    projectOwnerAddress,
    handle,
    loading,
  } = useContext(V2ProjectContext)

  const [handleModalVisible, setHandleModalVisible] = useState<boolean>()

  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )
  const {
    data: queuedFundingCycleResponse,
    loading: queuedFundingCycleLoading,
  } = useProjectQueuedFundingCycle({
    projectId,
  })
  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const isOwner = useIsUserAddress(projectOwnerAddress)

  const allFundingCyclesLoading =
    loading.fundingCycleLoading || queuedFundingCycleLoading
  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)
  const showRelaunchFundingCycleBanner =
    !allFundingCyclesLoading &&
    !hasCurrentFundingCycle &&
    !hasQueuedFundingCycle &&
    canReconfigureFundingCycles

  const showAddHandle = isOwner && !isPreviewMode && !handle

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={40} style={{ width: '100%' }}>
      {showRelaunchFundingCycleBanner && <RelaunchFundingCycleBanner />}

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        owner={projectOwnerAddress}
        onClickSetHandle={
          showAddHandle ? () => setHandleModalVisible(true) : undefined
        }
      />
      <V2ProjectInfo
        handleModalVisible={handleModalVisible}
        setHandleModalVisible={setHandleModalVisible}
      />
    </Space>
  )
}
