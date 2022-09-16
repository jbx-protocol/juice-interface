import { t } from '@lingui/macro'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { onCatch, TransactorInstance } from 'hooks/Transactor'

export function useIssueErc20TokenTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)

  return ({ name, symbol }, txOpts) => {
    try {
      invariant(
        transactor && projectId && contracts?.JBController && name && symbol,
      )
      return transactor(
        contracts.JBController,
        'issueTokenFor',
        [projectId, name, symbol],
        {
          ...txOpts,
          title: t`Issue $${symbol}`,
        },
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
        cv,
      })
    }
  }
}
