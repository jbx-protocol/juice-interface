import { ethers } from 'ethers'
import { TransactorInstance } from 'hooks/useTransactor'
import { useSetOperatorTx } from 'packages/v2v3/hooks/transactor/useSetOperatorTx'
import { V2V3OperatorPermission } from 'packages/v2v3/models/permissions'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/useJBTiered721DelegateProjectDeployer'
import { useProjectControllerJB721DelegateVersion } from '../contracts/useProjectJB721DelegateVersion'

export function useSetNftOperatorPermissionsTx(): TransactorInstance {
  const setOperatorTx = useSetOperatorTx()

  const JB721DelegateVersion = useProjectControllerJB721DelegateVersion()
  const JBTiered721DelegateProjectDeployer =
    useJBTiered721DelegateProjectDeployer({ version: JB721DelegateVersion })

  return (_, txOpts) => {
    const operator = ethers.getAddress(
      // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
      (JBTiered721DelegateProjectDeployer?.target as string | undefined) ?? '',
    )

    return setOperatorTx(
      {
        operatorAddress: operator,
        permissionIndexes: [V2V3OperatorPermission.RECONFIGURE],
      },
      txOpts,
    )
  }
}
