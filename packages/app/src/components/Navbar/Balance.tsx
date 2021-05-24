import { BigNumber } from '@ethersproject/bignumber'
import EthPrice from 'components/Dashboard/EthPrice'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useEtherPrice } from 'hooks/EtherPrice'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatCurrency'

export default function Balance({ userAddress }: { userAddress: string }) {
  const { signingProvider } = useContext(NetworkContext)
  const [dollarMode, setDollarMode] = useState(false)
  const [balance, setBalance] = useState<BigNumber>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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
      ? `$${balance ? formatWad(balance.mul(usdPerEth).toString()) : '--'}`
      : `${parseFloat(formatWad(balance) ?? '0').toFixed(4)}ETH`

  return (
    <div
      style={{
        verticalAlign: 'middle',
        cursor: 'pointer',
        lineHeight: 1,
      }}
      onClick={() => setDollarMode(!dollarMode)}
    >
      {displayBalance}
      <div style={{ color: colors.text.tertiary }}>
        <EthPrice />
      </div>
    </div>
  )
}
