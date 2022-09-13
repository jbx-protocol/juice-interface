import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

type DistributeReserveTokensTx = TransactorInstance<{
  memo?: string
}>

export function useDistributeReservedTokens(): DistributeReserveTokensTx {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ memo = '' }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBController) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBController,
      'distributeReservedTokensOf',
      [projectId, memo],
      txOpts,
    )
  }
}
