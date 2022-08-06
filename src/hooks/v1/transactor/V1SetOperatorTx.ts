import { useContext } from 'react'
import { V1UserContext } from 'contexts/v1/userContext'
import { useSigner } from 'wagmi'

import { TransactorInstance } from '../../Transactor'

type OperatorData = {
  operator: string
  domain: number // projectId (or 0, for any project)
  permissionIndexes: number[]
}

export function useV1SetOperatorTx(): TransactorInstance<OperatorData> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { data: signer } = useSigner()

  return ({ operator, domain, permissionIndexes }: OperatorData, txOpts) => {
    if (!transactor || !signer || !contracts?.OperatorStore) {
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
