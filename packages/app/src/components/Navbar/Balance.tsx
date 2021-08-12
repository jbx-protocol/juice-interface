import { BigNumber } from '@ethersproject/bignumber'
import EthPrice from 'components/Dashboard/EthPrice'
import { ThemeContext } from 'contexts/themeContext'
import { usePoller } from 'hooks/Poller'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatNumber'

import { readProvider } from '../../constants/readProvider'
import CurrencySymbol from '../shared/CurrencySymbol'

export default function Balance({
  address,
  showEthPrice,
}: {
  address: string | undefined
  showEthPrice?: boolean
}) {
  const [balance, setBalance] = useState<BigNumber>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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

  return (
    <div
      style={{
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
    >
      <CurrencySymbol currency={0} />
      {formatWad(balance) ?? '--'}
      {showEthPrice && (
        <div style={{ color: colors.text.tertiary }}>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
