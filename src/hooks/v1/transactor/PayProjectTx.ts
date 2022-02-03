import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function usePayProjectTx(): TransactorInstance<{
  note: string
  preferUnstaked: boolean
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, projectId } = useContext(V1ProjectContext)
  const { userAddress } = useContext(NetworkContext)

  return ({ note, preferUnstaked, value }, txOpts) => {
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
      'pay',
      [projectId.toHexString(), userAddress, note || '', preferUnstaked],
      {
        ...txOpts,
        value: value.toHexString(),
      },
    )
  }
}
