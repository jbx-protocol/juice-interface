import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'
import { handleTransact } from 'utils/transactor'

import { TransactorInstance } from '../../Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  newOwnerAddress: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, owner } = useContext(V1ProjectContext)

  return ({ newOwnerAddress }, txOpts) => {
    return handleTransact({
      transactor,
      contract: contracts?.Projects,
      fnName: 'safeTransferFrom(address,address,uint256)',
      args: [owner, newOwnerAddress, BigNumber.from(projectId).toHexString()],
      txOpts,
      version: 'v1',
      optionalArgs: [],
    })
  }
}
