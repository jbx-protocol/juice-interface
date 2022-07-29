import { useContext } from 'react'
import { V2UserContext } from 'contexts/v2/userContext'

import { TransactorInstance } from 'hooks/Transactor'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

export function useUnclaimedTokensPermissionTx(): TransactorInstance {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const contractAddress = VENFT_CONTRACT_ADDRESS
  const permissionIndexes = [12]

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
