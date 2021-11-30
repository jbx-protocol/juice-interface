import { BigNumber } from 'ethers'
import { useState } from 'react'

import { readProvider } from 'constants/readProvider'

import { usePoller } from './Poller'

export function useEthBalance(address: string | undefined) {
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
