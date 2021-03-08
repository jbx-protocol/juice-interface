import { BigNumber } from '@ethersproject/bignumber'
import { formatEther, parseEther } from '@ethersproject/units'
import { UserContext } from 'contexts/userContext'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'

export default function Balance({ userAddress }: { userAddress?: string }) {
  const { userProvider, ethInCents } = useContext(UserContext)
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
    [userAddress, userProvider],
    30000,
  )

  const displayBalance =
    ethInCents && dollarMode
      ? `$${
          balance
            ? formatEther(
                balance
                  .mul(ethInCents)
                  .div(100)
                  .toString(),
              )
            : '--'
        }`
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
