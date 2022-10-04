import { t } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

type DistributeReserveTokensTx = TransactorInstance<{
  memo?: string
}>

export function useDistributeReservedTokens(): DistributeReserveTokensTx {
  const { transactor } = useContext(TransactionContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ memo = '' }, txOpts) => {
    if (!transactor || !projectId || !JBController) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      JBController,
      'distributeReservedTokensOf',
      [projectId, memo],
      {
        ...txOpts,
        title: t`Distribute reserved ${tokenSymbolText({
          tokenSymbol,
          plural: true,
        })}`,
      },
    )
  }
}
