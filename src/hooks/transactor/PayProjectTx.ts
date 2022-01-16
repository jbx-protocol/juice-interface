import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function usePayProjectTx(): TransactorInstance<{
  note: string
  preferUnstaked: boolean
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { terminal, projectId } = useContext(ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  return ({ note, preferUnstaked, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !userAddress ||
      !contracts?.TicketBooth ||
      !terminal?.version
    ) {
      if (txOpts?.onDone) txOpts.onDone()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'pay',
      [projectId.toHexString(), userAddress, note || '', preferUnstaked],
      {
        ...txOpts,
        value: value.toHexString(),
      },
    )
  }
}
