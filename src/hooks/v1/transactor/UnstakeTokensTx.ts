import { NetworkContext } from 'contexts/networkContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { V1UserContext } from 'contexts/v1/userContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'

import { TransactorInstance } from '../../Transactor'

export function useUnstakeTokensTx(): TransactorInstance<{
  unstakeAmount: BigNumber
}> {
  const { transactor, contracts } = useContext(V1UserContext)
  const { userAddress } = useContext(NetworkContext)
  const { projectId } = useContext(V1ProjectContext)

  return ({ unstakeAmount }, txOpts) => {
    if (!transactor || !userAddress || !projectId || !contracts?.TicketBooth) {
      txOpts?.onDone?.()
      return Promise.resolve(false)
    }

    return transactor(
      contracts.TicketBooth,
      'unstake',
      [userAddress, projectId.toHexString(), unstakeAmount.toHexString()],
      txOpts,
    )
  }
}
