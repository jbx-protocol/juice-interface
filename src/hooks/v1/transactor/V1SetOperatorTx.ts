import { t } from '@lingui/macro'
import { V1UserContext } from 'contexts/v1/userContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { useV1ProjectTitle } from '../ProjectTitle'

type OperatorData = {
  operator: string
  domain: number // projectId (or 0, for any project)
  permissionIndexes: number[]
}

export function useV1SetOperatorTx(): TransactorInstance<OperatorData> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { signer } = useWallet()
  const projectTitle = useV1ProjectTitle()

  return ({ operator, domain, permissionIndexes }: OperatorData, txOpts) => {
    if (!transactor || !signer || !contracts?.OperatorStore) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.OperatorStore,
      'setOperator',
      [operator, domain, permissionIndexes],
      {
        ...txOpts,
        title: t`Set operator for ${projectTitle}`,
      },
    )
  }
}
