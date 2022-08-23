import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

import { V2ProjectContext } from 'contexts/v2/projectContext'

export function useUnclaimedTokensPermissionTx(): TransactorInstance {
  const { transactor, contracts } = useContext(V2UserContext)
  const {
    projectId,
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  const permissionIndexes = [12] // TRANSFER permission, https://github.com/jbx-protocol/juice-contracts-v2/blob/main/contracts/libraries/JBOperations.sol

  return (_, txOpts) => {
    if (!transactor || !contracts || !projectId || !contractAddress) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBOperatorStore,
      'setOperator',
      [{ operator: contractAddress, domain: projectId, permissionIndexes }],
      {
        ...txOpts,
      },
    )
  }
}
