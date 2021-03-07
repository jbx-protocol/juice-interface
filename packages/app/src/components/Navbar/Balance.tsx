import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { UserContext } from 'contexts/userContext'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'

export default function Balance({
  userAddress,
  dollarMultiplier,
}: {
  userAddress?: string
  dollarMultiplier: number
}) {
  const { userProvider } = useContext(UserContext)
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()

  // get updated balance
  usePoller(
    () => {
      if (!userAddress || !userProvider) return

      try {
        userProvider.getBalance(userAddress).then(setBalance)
      } catch (e) {
        console.log('Error getting balance', e)
      }
    },
    [],
    30000,
  )

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
        cursor: 'pointer',
      }}
      onClick={() => setDollarMode(!dollarMode)}
    >
      {displayBalance}
    </span>
  )
}
