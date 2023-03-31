import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import useProjectControllerAddress from 'hooks/v2v3/contractReader/ProjectControllerAddress'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'
import { isZeroAddress } from 'utils/address'
import { RelaunchFundingCycleBanner } from './RelaunchFundingCycleBanner'
import { V2BugNoticeBanner } from './V2BugNoticeBanner'

export function ProjectBanners() {
  const { projectId, pv } = useContext(ProjectMetadataContext)
  const {
    contracts,
    loading: { projectContractsLoading },
  } = useContext(V2V3ProjectContractsContext)

  const canReconfigureFundingCycles = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.RECONFIGURE,
  )

  // get the projects controller address on the deprecated JBDirectory (the bugged version)
  const { data: controllerAddress } = useProjectControllerAddress({
    projectId,
    useDeprecatedContract: true,
  })

  const isV2Project = pv === PV_V2

  // if the project was created on the bugged version of the JBDirectory, it will have a non-zero controller address.
  const hasProjectOnDeprecatedContracts =
    controllerAddress && !isZeroAddress(controllerAddress)

  // if the project has upgraded to the new contracts, have a defined JBController.
  const hasUpgradedJBController = contracts?.JBController !== undefined

  // show banner if a V2 project was launched on the bugged contracts and hasn't upgraded.
  const showV2BugNoticeBanner = Boolean(
    isV2Project &&
      !projectContractsLoading?.JBControllerLoading &&
      hasProjectOnDeprecatedContracts &&
      !hasUpgradedJBController,
  )

  const showRelaunchFundingCycleBanner =
    showV2BugNoticeBanner && canReconfigureFundingCycles

  const hasBanners = showV2BugNoticeBanner || showRelaunchFundingCycleBanner

  if (!hasBanners) return null

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col">
      {showV2BugNoticeBanner && <V2BugNoticeBanner />}
      {showRelaunchFundingCycleBanner && <RelaunchFundingCycleBanner />}
    </div>
  )
}
