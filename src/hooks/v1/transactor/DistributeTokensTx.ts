import { BigNumber } from '@ethersproject/bignumber'
import { t } from '@lingui/macro'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useDistributeTokensTx(): TransactorInstance {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, projectId, tokenSymbol } = useContext(V1ProjectContext)

  return (_, txOpts) => {
    if (!transactor || !terminal || !projectId || !contracts) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'printReservedTickets',
      [BigNumber.from(projectId).toHexString()],
      {
        ...txOpts,
        title: tokenSymbol
          ? t`Distribute reserved $${tokenSymbol}`
          : t`Distribute reserved tokens`,
      },
    )
  }
}
