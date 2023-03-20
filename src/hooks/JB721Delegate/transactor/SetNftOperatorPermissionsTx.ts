import { getAddress } from '@ethersproject/address'
import { TransactorInstance } from 'hooks/Transactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/SetOperatorTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/JBTiered721DelegateProjectDeployer'
import { useProjectControllerJB721DelegateVersion } from '../contracts/ProjectJB721DelegateVersion'

export function useSetNftOperatorPermissionsTx(): TransactorInstance {
  const setOperatorTx = useSetOperatorTx()

  const JB721DelegateVersion = useProjectControllerJB721DelegateVersion()
  const JBTiered721DelegateProjectDeployer =
    useJBTiered721DelegateProjectDeployer({ version: JB721DelegateVersion })

  return (_, txOpts) => {
    const operator = getAddress(
      JBTiered721DelegateProjectDeployer?.address ?? '',
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
