import { getAddress } from '@ethersproject/address'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useSetOperatorTx } from 'hooks/v2v3/transactor/SetOperatorTx'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { useContext } from 'react'

export function useSetNftOperatorPermissionsTx(): TransactorInstance {
  const { contracts } = useContext(V2V3ContractsContext)
  const setOperatorTx = useSetOperatorTx()

  return (_, txOpts) => {
    const operator = getAddress(
      contracts?.JBTiered721DelegateProjectDeployer.address ?? '',
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
