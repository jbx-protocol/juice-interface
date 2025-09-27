import { V4OperatorPermission } from 'packages/v4v5/models/v4Permissions'
import { useV4WalletHasPermission } from '../../useV4WalletHasPermission'

/**
 * Checks whether the given [projectOwnerAddress] has given the JBTiered721DelegateProjectDeployer
 * permission to queue rulesets for the given [projectId].
 *
 * This must be true for the following circumstances (non-exhaustive):
 * - A project is reconfiguring their FC to include NFTs
 * - A project is launching their V3 FC with NFTs
 */
export function useNftDeployerCanReconfigure() {
  const JBTiered721DelegateProjectDeployerCanReconfigure = useV4WalletHasPermission(V4OperatorPermission.QUEUE_RULESETS)

  return JBTiered721DelegateProjectDeployerCanReconfigure
}
