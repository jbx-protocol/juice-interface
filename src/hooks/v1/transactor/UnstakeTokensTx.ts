import { useWallet } from 'hooks/Wallet'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from '@ethersproject/bignumber'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useUnstakeTokensTx(): TransactorInstance<{
  unstakeAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useWallet()
  const { projectId } = useContext(V1ProjectContext)

  return ({ unstakeAmount }, txOpts) => {
    if (!transactor || !userAddress || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'unstake',
      [
        userAddress,
        BigNumber.from(projectId).toHexString(),
        unstakeAmount.toHexString(),
      ],
      txOpts,
    )
  }
}
