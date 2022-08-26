import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { onCatch, TransactorInstance } from '../../Transactor'

export function useIssueTokensTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts, version } = useContext(V2UserContext)
  const { projectId } = useContext(V2ProjectContext)

  return ({ name, symbol }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBTokenStore) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.JBTokenStore
        ? 'contracts.JBTokenStore'
        : !name
        ? 'name'
        : !symbol
        ? 'symbol'
        : undefined

      return onCatch({
        fnName: 'issueTokenFor',
        missingParam,
        txOpts,
        version,
      })
    }

    return transactor(
      contracts.JBController,
      'issueTokenFor',
      [projectId, name, symbol],
      txOpts,
    )
  }
}
