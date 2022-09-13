import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  newOwnerAddress: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, owner } = useContext(V1ProjectContext)

  return ({ newOwnerAddress }, txOpts) => {
    if (!transactor || !projectId || !contracts?.Projects) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.Projects
        ? 'contracts.Projects'
        : !newOwnerAddress
        ? 'newOwnerAddress'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${
            missingParam ?? 'parameter` not found'
          } in v1 SafeTransferFromTx`,
        ),
      )

      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.Projects,
      'safeTransferFrom(address,address,uint256)',
      [owner, newOwnerAddress, BigNumber.from(projectId).toHexString()],
      txOpts,
    )
  }
}
