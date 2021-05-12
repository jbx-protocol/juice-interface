import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'
import { UserContext } from 'contexts/userContext'
import { useEtherPrice } from 'hooks/EtherPrice'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'

export default function Balance({ userAddress }: { userAddress?: string }) {
  const { signingProvider } = useContext(UserContext)
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()

  const usdPerEth = useEtherPrice()

  // get updated balance
  usePoller(
    () => {
      if (!userAddress || !signingProvider) return

      try {
        signingProvider.getBalance(userAddress).then(setBalance)
      } catch (e) {
        console.log('Error getting balance', e)
      }
    },
    [userAddress, signingProvider],
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
