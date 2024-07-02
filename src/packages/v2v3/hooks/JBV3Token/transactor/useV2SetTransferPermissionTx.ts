import { TransactorInstance } from 'hooks/useTransactor'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useSetOperatorTx } from 'packages/v2v3/hooks/transactor/useSetOperatorTx'
import { V2V3OperatorPermission } from 'packages/v2v3/models/permissions'
import { useContext } from 'react'
import { useJBOperatorStoreForV3Token } from '../contracts/useJBOperatorStoreForV3Token'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useV2SetTransferPermissionTx(): TransactorInstance {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const setOperatorTx = useSetOperatorTx()

  const JBOperatorStore = useJBOperatorStoreForV3Token()

  return (_, txOpts) => {
    if (!JBOperatorStore || !JBV3TokenContract) return Promise.reject()

    return setOperatorTx(
      {
        operatorAddress: JBV3TokenContract?.address,
        permissionIndexes: [V2V3OperatorPermission.TRANSFER],
        contractOverride: JBOperatorStore,
      },
      txOpts,
    )
  }
}
