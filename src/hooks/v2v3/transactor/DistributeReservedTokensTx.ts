import { t } from '@lingui/macro'
import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { TransactionContext } from 'contexts/transactionContext'
import { TransactorInstance } from 'hooks/Transactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

type DistributeReserveTokensTx = TransactorInstance<{
  memo?: string
}>

export function useDistributeReservedTokens(): DistributeReserveTokensTx {
  const { transactor } = useContext(TransactionContext)
  const { contracts } = useContext(V2V3ContractsContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  return ({ memo = '' }, txOpts) => {
    if (!transactor || !projectId || !contracts?.JBController) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.JBController,
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
