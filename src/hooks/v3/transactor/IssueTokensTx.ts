import { V3ProjectContext } from 'contexts/v3/projectContext'
import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

import { onCatch, TransactorInstance } from 'hooks/Transactor'

export function useIssueTokensTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts, version } = useContext(V3UserContext)
  const { projectId } = useContext(V3ProjectContext)

  return ({ name, symbol }, txOpts) => {
    try {
      invariant(
        transactor && projectId && contracts?.JBController && name && symbol,
      )
      return transactor(
        contracts.JBController,
        'issueTokenFor',
        [projectId, name, symbol],
        txOpts,
      )
    } catch {
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
        txOpts,
        missingParam,
        functionName: 'issueTokenFor',
        version,
      })
    }
  }
}
