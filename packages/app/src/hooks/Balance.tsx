import { BigNumber } from '@ethersproject/bignumber'
import { useState } from 'react'

import { usePoller } from './Poller'
import { readProvider } from '../constants/readProvider'

export default function useBalance({
  address,
}: {
  address: string | undefined
}) {
  const [balance, setBalance] = useState<BigNumber>()
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
