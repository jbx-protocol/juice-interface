import { getAddress } from 'ethers/lib/utils'
import { TransactorInstance } from 'hooks/useTransactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/useSetOperatorTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useJBTiered721DelegateProjectDeployer } from '../contracts/useJBTiered721DelegateProjectDeployer'
import { useProjectControllerJB721DelegateVersion } from '../contracts/useProjectJB721DelegateVersion'

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
