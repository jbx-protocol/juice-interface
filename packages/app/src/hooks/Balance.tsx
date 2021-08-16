import { readProvider } from 'constants/readProvider'
import { BigNumber } from 'ethers'
import { useState } from 'react'

import { usePoller } from './Poller'

export function useBalance(address: string | undefined) {
  const [balance, setBalance] = useState<BigNumber>()

  // get updated balance
  usePoller(
    () => {
      if (!address) return

      try {
        readProvider.getBalance(address).then(setBalance)
      } catch (e) {
        console.log('Error getting balance', e)
      }
    },
    [address],
    30000,
  )

  return balance
}
