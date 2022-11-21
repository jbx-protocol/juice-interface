import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { getAddress } from 'ethers/lib/utils'
import { useV2HasPermissions } from 'hooks/v2v3/contractReader/V2HasPermissions'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'

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
  const { contracts } = useContext(V2V3ContractsContext)

  const JBTiered721DelegateProjectDeployerAddress = contracts
    ? getAddress(contracts.JBTiered721DelegateProjectDeployer.address)
    : undefined

  const { data: JBTiered721DelegateProjectDeployerCanReconfigure } =
    useV2HasPermissions({
      operator: JBTiered721DelegateProjectDeployerAddress,
      account: projectOwnerAddress,
      domain: projectId,
      permissions: [V2OperatorPermission.RECONFIGURE],
    })

  return JBTiered721DelegateProjectDeployerCanReconfigure
}
