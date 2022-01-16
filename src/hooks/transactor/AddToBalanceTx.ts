import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useAddToBalanceTx(): TransactorInstance<{
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { projectId } = useContext(ProjectContext)

  return ({ value }, txOpts) => {
    if (!transactor || !projectId || !contracts?.TicketBooth) {
      if (txOpts?.onDone) txOpts.onDone()
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
