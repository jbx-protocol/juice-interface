import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { Contract } from '@ethersproject/contracts'
import { useContext } from 'react'
import v1OperatorStoreJSON from '@jbx-protocol/contracts-v1/deployments/rinkeby/OperatorStore.json'
import { NetworkContext } from 'contexts/networkContext'

import { TransactorInstance } from '../../Transactor'

type OperatorData = {
  operator: string
  domain: number // projectId (or 0, for any project)
  permissionIndexes: number[]
}

export function useSetOperatorTx(): TransactorInstance<OperatorData> {
  const { transactor } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)
  const { signingProvider } = useContext(NetworkContext)

  return ({ operator, domain, permissionIndexes }: OperatorData, txOpts) => {
    if (!transactor || !projectId || !signingProvider) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    const contract = new Contract(
      v1OperatorStoreJSON.address,
      v1OperatorStoreJSON.abi,
      signingProvider.getSigner(),
    )

    return transactor(
      contract,
      'setOperator',
      [operator, domain, permissionIndexes],
      txOpts,
    )
  }
}
