import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'
import { isDefined } from 'utils/isDefined'

import { onCatch, TransactorInstance } from '../../Transactor'

export function useSafeTransferFromTx(): TransactorInstance<{
  newOwnerAddress: string
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, owner } = useContext(V1ProjectContext)

  return ({ newOwnerAddress }, txOpts) => {
    isDefined(transactor && contracts?.Projects && projectId && owner)
    try {
      return transactor(
        contracts.Projects,
        'safeTransferFrom(address,address,uint256)',
        [owner, newOwnerAddress, BigNumber.from(projectId).toHexString()],
        txOpts,
      )
    } catch (_) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.Projects
        ? 'contracts.Projects'
        : !newOwnerAddress
        ? 'newOwnerAddress'
        : undefined

      return onCatch(missingParam, 'safeTransferFrom', 'v1', txOpts)
    }
  }
}
