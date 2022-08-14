import { Space } from 'antd'
import ProjectHeader from 'components/Project/ProjectHeader'
import { V2ProjectContext } from 'contexts/v2/projectContext'
// TODO: Do we still need lazy loading?

import { useContext, useEffect, useState } from 'react'

import { useV2ConnectedWalletHasPermission } from 'hooks/v2/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2/permissions'
import useProjectQueuedFundingCycle from 'hooks/v2/contractReader/ProjectQueuedFundingCycle'

import { useIsUserAddress } from 'hooks/IsUserAddress'

import { ProjectPage } from 'models/project-visibility'

import { useRouter } from 'next/router'

import { pushSettingsContent } from 'utils/pushSettingsPage'

import { RelaunchFundingCycleBanner } from './banners/RelaunchFundingCycleBanner'
import V2ProjectHeaderActions from './V2ProjectHeaderActions'

import V2ProjectInfo from './V2ProjectInfo'
import V2ProjectSettings from './V2ProjectSettingsPage/V2ProjectSettings'

const defaultPage: ProjectPage = 'info'

export default function V2Project() {
  const {
    projectId,
    projectMetadata,
    fundingCycle,
    isPreviewMode,
    isArchived,
    projectOwnerAddress,
    handle,
  } = useContext(V2ProjectContext)

  const [activePage, setActivePage] = useState<ProjectPage>(defaultPage)

  const router = useRouter()
  useEffect(() => {
    setActivePage(() => {
      switch (router.query.page) {
        case 'info':
          return 'info'
        case 'settings':
          return 'settings'
        default:
          return defaultPage
      }
    })
  }, [router.query.page])

  const [handleModalVisible, setHandleModalVisible] = useState<boolean>()

  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  const { data: queuedFundingCycleResponse } = useProjectQueuedFundingCycle({
    projectId,
  })

  const [queuedFundingCycle] = queuedFundingCycleResponse || []

  const isOwner = useIsUserAddress(projectOwnerAddress)

  const hasCurrentFundingCycle = fundingCycle?.number.gt(0)
  const hasQueuedFundingCycle = queuedFundingCycle?.number.gt(0)
  const showAddHandle = isOwner && !isPreviewMode && !handle

  if (projectId === undefined) return null

  return (
    <Space direction="vertical" size={40} style={{ width: '100%' }}>
      {!hasCurrentFundingCycle &&
      !hasQueuedFundingCycle &&
      canReconfigureFundingCycles ? (
        <RelaunchFundingCycleBanner />
      ) : null}

      <ProjectHeader
        metadata={projectMetadata}
        actions={!isPreviewMode ? <V2ProjectHeaderActions /> : undefined}
        isArchived={isArchived}
        handle={handle}
        owner={projectOwnerAddress}
        onClickSetHandle={
          showAddHandle
            ? () => pushSettingsContent(router, 'projecthandle')
            : undefined
        }
      />
      {activePage === 'info' && (
        <V2ProjectInfo
          handleModalVisible={handleModalVisible}
          setHandleModalVisible={setHandleModalVisible}
        />
      )}
      {activePage === 'settings' && <V2ProjectSettings />}
    </Space>
  )
}
