import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { useState } from 'react'

import { localProvider } from '../constants/local-provider'
import { usePoller } from '../hooks/Poller'

export default function Balance({
  userAddress,
  dollarMultiplier,
}: {
  userAddress?: string
  dollarMultiplier: number
}) {
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()

  // get updated balance
  usePoller(() => {
    if (!userAddress) return

    try {
      localProvider.getBalance(userAddress).then(setBalance)
    } catch (e) {
      console.log('Error getting balance', e)
    }
  })

  let floatBalance = parseFloat(balance ? formatEther(balance) : '0.00')

  const displayBalance =
    dollarMultiplier && dollarMode
      ? `$${(floatBalance * dollarMultiplier).toFixed(2)}`
      : `${floatBalance.toFixed(4)}ETH`

  if (!userAddress) return null

  return (
    <span
      style={{
        verticalAlign: 'middle',
        padding: 8,
        cursor: 'pointer',
      }}
      onClick={() => setDollarMode(!dollarMode)}
    >
      {displayBalance}
    </span>
  )
}
