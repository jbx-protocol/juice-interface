import { TransactorInstance } from 'hooks/Transactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/SetOperatorTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useJBV3TokenDeployer } from '../contracts/JBV3TokenDeployer'

export function useSetChangeTokenPermissionTx(): TransactorInstance {
  const deployer = useJBV3TokenDeployer()
  const setOperatorTx = useSetOperatorTx()

  return (_, txOpts) => {
    return setOperatorTx(
      {
        operatorAddress: deployer?.address,
        permissionIndexes: [V2V3OperatorPermission.CHANGE_TOKEN],
      },
      txOpts,
    )
  }
}
