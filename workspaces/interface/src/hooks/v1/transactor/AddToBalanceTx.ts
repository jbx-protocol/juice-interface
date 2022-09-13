import { BigNumber } from '@ethersproject/bignumber'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useContext } from 'react'

import { TransactorInstance } from 'hooks/Transactor'

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId, terminal } = useContext(V1ProjectContext)

  return ({ value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.TicketBooth ||
      !terminal?.version
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'addToBalance',
      [BigNumber.from(projectId).toHexString()],
      {
        ...txOpts,
        value: value.toHexString(),
      },
    )
  }
}
