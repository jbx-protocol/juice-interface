import { useWallet } from 'hooks/Wallet'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useRedeemTokensTx(): TransactorInstance<{
  redeemAmount: BigNumber
  minAmount: BigNumber
  preferConverted: boolean
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useWallet()
  const { projectId, terminal } = useContext(V1ProjectContext)

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
        BigNumber.from(projectId).toHexString(),
        redeemAmount.toHexString(),
        minAmount.toHexString(),
        userAddress,
        preferConverted,
      ],
      txOpts,
    )
  }
}
