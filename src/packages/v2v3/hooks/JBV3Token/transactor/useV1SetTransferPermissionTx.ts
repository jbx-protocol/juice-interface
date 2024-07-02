import { TransactorInstance } from 'hooks/useTransactor'
import { useV1SetOperatorTx } from 'packages/v1/hooks/transactor/useV1SetOperatorTx'
import { V1OperatorPermission } from 'packages/v1/models/permissions'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext } from 'react'
import { useJBV3Token } from '../contracts/useJBV3Token'

export function useV1SetTransferPermissionTx(): TransactorInstance<{
  v1ProjectId: bigint | undefined
}> {
  const { tokenAddress } = useContext(V2V3ProjectContext)

  const JBV3TokenContract = useJBV3Token({ tokenAddress })
  const setOperatorTx = useV1SetOperatorTx()

  return ({ v1ProjectId }, txOpts) => {
    if (!JBV3TokenContract || !v1ProjectId) return Promise.reject()

    return setOperatorTx(
      {
        // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
        operator: JBV3TokenContract?.target as string,
        permissionIndexes: [V1OperatorPermission.Transfer],
        domain: Number(v1ProjectId),
      },
      txOpts,
    )
  }
}
