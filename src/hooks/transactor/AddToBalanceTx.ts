import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { projectId } = useContext(V1ProjectContext)

  return ({ value }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TerminalV1,
      'addToBalance',
      [projectId.toHexString()],
      {
        ...txOpts,
        value: value.toHexString(),
      },
    )
  }
}
