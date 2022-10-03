import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'
import invariant from 'tiny-invariant'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import {
  handleTransactionException,
  TransactorInstance,
} from 'hooks/Transactor'

export function useV2IssueErc20TokenTx(): TransactorInstance<{
  name: string
  symbol: string
}> {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { projectId, cv } = useContext(ProjectMetadataContext)
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)

  return ({ name, symbol }, txOpts) => {
    try {
      invariant(transactor && projectId && JBController && name && symbol)
      return transactor(
        JBController,
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

      return handleTransactionException({
        txOpts,
        missingParam,
        functionName: 'issueTokenFor',
        cv,
      })
    }
  }
}
