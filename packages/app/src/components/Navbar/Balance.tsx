import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { UserContext } from 'contexts/userContext'
import { useExchangePrice } from 'hooks/ExchangePrice'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'

export default function Balance({ userAddress }: { userAddress?: string }) {
  const { userProvider } = useContext(UserContext)
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()

  const usdPerEth = useExchangePrice()

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
    [userAddress, userProvider],
    30000,
  )

  const displayBalance =
    usdPerEth && dollarMode
      ? `$${balance ? formatEther(balance.mul(usdPerEth).toString()) : '--'}`
      : `${parseFloat(balance ? formatEther(balance) : '0.00').toFixed(4)}ETH`

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
