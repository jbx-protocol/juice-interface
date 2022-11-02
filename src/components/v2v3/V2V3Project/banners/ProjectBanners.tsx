import { AddressZero } from '@ethersproject/constants'
import { Space } from 'antd'
import { CV_V2 } from 'constants/cv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import useProjectController from 'hooks/v2v3/contractReader/ProjectController'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { RelaunchFundingCycleBanner } from './RelaunchFundingCycleBanner'
import { V2BugNoticeBanner } from './V2BugNoticeBanner'

export function ProjectBanners() {
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const { isPreviewMode } = useContext(V2V3ProjectContext)
  const {
    contracts,
    loading: { projectContractsLoading },
  } = useContext(V2V3ProjectContractsContext)

  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.RECONFIGURE,
  )

  // get the projects controller address on the deprecated JBDirectory (the bugged version)
  const { data: controllerAddress } = useProjectController({
    projectId,
    useDeprecatedContract: true,
  })

  const isV2Project = !isPreviewMode && cv === CV_V2

  // if the project was created on the bugged version of the JBDirectory, it will have a non-zero controller address.
  const hasProjectOnDeprecatedContracts =
    controllerAddress && controllerAddress !== AddressZero

  // if the project has upgraded to the new contracts, have a defined JBController.
  const hasUpgradedJBController = contracts?.JBController !== undefined

  // show banner if a V2 project was launched on the bugged contracts and hasn't upgraded.
  const showV2BugNoticeBanner =
    isV2Project &&
    !projectContractsLoading?.JBControllerLoading &&
    hasProjectOnDeprecatedContracts &&
    !hasUpgradedJBController

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
