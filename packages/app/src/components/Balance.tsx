import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'
import { formatEther } from '@ethersproject/units'
import { useState } from 'react'

import { usePoller } from '../hooks/Poller'

export default function Balance({
  userAddress,
  provider,
  balance,
  dollarMultiplier,
}: {
  userAddress?: string
  provider?: JsonRpcProvider
  balance?: BigNumber
  dollarMultiplier: number
}) {
  const [dollarMode, setDollarMode] = useState(false)
  const [_balance, setBalance] = useState<BigNumber>()

  // get updated balance
  usePoller(() => {
    if (!userAddress || !provider) return

    try {
      provider.getBalance(userAddress).then(setBalance)
    } catch (e) {
      console.log('Error getting balance', e)
    }
  })

  let floatBalance = parseFloat('0.00')

  const usingBalance = balance ?? _balance

  if (usingBalance !== undefined) {
    const etherBalance = formatEther(usingBalance)
    floatBalance = parseFloat(etherBalance)
  }

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
