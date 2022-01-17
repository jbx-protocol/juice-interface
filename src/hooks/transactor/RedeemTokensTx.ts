import { NetworkContext } from 'contexts/networkContext'
import { ProjectContext } from 'contexts/projectContext'
import { UserContext } from 'contexts/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from './Transactor'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minAmount: BigNumber
  preferConverted: boolean
}> {
  const { transactor, contracts } = useContext(UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId, terminal } = useContext(ProjectContext)

  return ({ redeemAmount, minAmount, preferConverted }, txOpts) => {
    if (
      !transactor ||
      !userAddress ||
      !projectId ||
      !contracts?.Projects ||
      !terminal?.version
    ) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'redeem',
      [
        userAddress,
        projectId.toHexString(),
        redeemAmount.toHexString(),
        minAmount.toHexString(),
        userAddress,
        preferConverted,
      ],
      txOpts,
    )
  }
}
