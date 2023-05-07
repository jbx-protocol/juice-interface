import { t } from '@lingui/macro'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'

import { DEFAULT_MEMO } from 'constants/transactionDefaults'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { TransactionContext } from 'contexts/Transaction/TransactionContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { TransactorInstance } from 'hooks/useTransactor'
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

  return ({ memo = DEFAULT_MEMO }, txOpts) => {
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
        title: t`Send reserved ${tokenSymbolText({
          tokenSymbol,
          plural: true,
        })}`,
      },
    )
  }
}
