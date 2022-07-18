import { useContext } from 'react'
import { NetworkContext } from 'contexts/networkContext'
import { V1UserContext } from 'contexts/v1/userContext'

import { TransactorInstance } from '../../Transactor'

type OperatorData = {
  operator: string
  domain: number // projectId (or 0, for any project)
  permissionIndexes: number[]
}

export function useV1SetOperatorTx(): TransactorInstance<OperatorData> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { signingProvider } = useContext(NetworkContext)

  return ({ operator, domain, permissionIndexes }: OperatorData, txOpts) => {
    if (!transactor || !signingProvider || !contracts?.OperatorStore) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.OperatorStore,
      'setOperator',
      [operator, domain, permissionIndexes],
      txOpts,
    )
  }
}
