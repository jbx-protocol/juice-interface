import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useIssueTokensTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ name, symbol }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBTokenStore) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBController,
      'issueTokenFor',
      [projectId, name, symbol],
      txOpts,
    )
  }
}
