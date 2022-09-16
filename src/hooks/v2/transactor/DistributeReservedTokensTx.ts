import { t } from '@lingui/macro'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'
import { tokenSymbolText } from 'utils/tokenSymbolText'

type DistributeReserveTokensTx = TransactorInstance<{
  memo?: string
}>

export function useDistributeReservedTokens(): DistributeReserveTokensTx {
  const { transactor, contracts } = useContext(V2UserContext)
  const { projectId, tokenSymbol } = useContext(V2ProjectContext)

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
