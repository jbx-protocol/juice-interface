import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/JBV3Token'
import { V1OperatorPermission } from 'models/v1/permissions'
import { useV1SetOperatorTx } from 'hooks/v1/transactor/V1SetOperatorTx'
import { BigNumber } from '@ethersproject/bignumber'

export function useV1SetTransferPermissionTx(): TransactorInstance<{
  v1ProjectId: BigNumber | undefined
}> {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const setOperatorTx = useV1SetOperatorTx()

  return ({ v1ProjectId }, txOpts) => {
    if (!JBV3TokenContract || !v1ProjectId) return Promise.reject()

    return setOperatorTx(
      {
        operator: JBV3TokenContract?.address,
        permissionIndexes: [V1OperatorPermission.Transfer],
        domain: v1ProjectId.toNumber(),
      },
      txOpts,
    )
  }
}
