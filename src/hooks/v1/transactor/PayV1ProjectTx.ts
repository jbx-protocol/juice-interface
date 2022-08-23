import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import { TransactorInstance } from '../../Transactor'

export function usePayV1ProjectTx(): TransactorInstance<{
  note: string
  preferUnstaked: boolean
  value: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { terminal, projectId } = useContext(V1ProjectContext)
  const { userAddress } = useWallet()

  return ({ note, preferUnstaked, value }, txOpts) => {
    if (
      !transactor ||
      !projectId ||
      !contracts?.TicketBooth ||
      !terminal?.version
    ) {
      const missingParam = !transactor
        ? 'transactor'
        : !projectId
        ? 'projectId'
        : !contracts?.TicketBooth
        ? 'contracts.TicketBooth'
        : !terminal?.version
        ? 'terminal.version'
        : null

      txOpts?.onError?.(
        new DOMException(
          `Missing ${missingParam ?? 'parameter not found'} in v1 transactor`,
        ),
      )
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'pay',
      [
        BigNumber.from(projectId).toHexString(),
        userAddress,
        note || '',
        preferUnstaked,
      ],
      {
        ...txOpts,
        value: value.toHexString(),
      },
    )
  }
}
