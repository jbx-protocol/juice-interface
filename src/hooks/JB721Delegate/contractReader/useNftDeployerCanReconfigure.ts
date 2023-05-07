import { getAddress } from 'ethers/lib/utils'
import { useV2V3HasPermissions } from 'hooks/v2v3/contractReader/useV2V3HasPermissions'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/useJBTiered721DelegateProjectDeployer'
import { useProjectControllerJB721DelegateVersion } from '../contracts/useProjectJB721DelegateVersion'

/**
 * Checks whether the given [projectOwnerAddress] has given the JBTiered721DelegateProjectDeployer
 * permission to reconfigure the given [projectId]s funding cycle.
 *
 * This must be true for the following circumstances (non-exhaustive):
 * - A project is reconfiguring their FC to include NFTs
 * - A project is launching their V3 FC with NFTs
 */
export function useNftDeployerCanReconfigure({
  projectOwnerAddress,
  projectId,
}: {
  projectOwnerAddress: string | undefined
  projectId: number | undefined
}) {
  const JB721DelegateVersion = useProjectControllerJB721DelegateVersion()
  const JBTiered721DelegateProjectDeployer =
    useJBTiered721DelegateProjectDeployer({ version: JB721DelegateVersion })

  const JBTiered721DelegateProjectDeployerAddress =
    JBTiered721DelegateProjectDeployer
      ? getAddress(JBTiered721DelegateProjectDeployer?.address)
      : undefined

  const { data: JBTiered721DelegateProjectDeployerCanReconfigure } =
    useV2V3HasPermissions({
      operator: JBTiered721DelegateProjectDeployerAddress,
      account: projectOwnerAddress,
      domain: projectId,
      permissions: [V2V3OperatorPermission.RECONFIGURE],
    })

  return JBTiered721DelegateProjectDeployerCanReconfigure
}
