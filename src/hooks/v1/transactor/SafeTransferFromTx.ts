import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { handleTransactor } from 'utils/transactorHelper'

import { TransactorInstance } from '../../Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  newOwnerAddress: string
}> {
  const { transactor, contracts, version } = useContext(V1UserContext)
  const { projectId: unformattedProjectId, owner } =
    useContext(V1ProjectContext)
  const projectId = BigNumber.from(unformattedProjectId).toHexString()

  return ({ newOwnerAddress }, txOpts) =>
    handleTransactor({
      transactor,
      contract: contracts?.Projects,
      args: [owner, newOwnerAddress, projectId],
      fnName: 'safeTransferFrom(address,address,uint256)',
      txOpts,
      version,
    })
}
