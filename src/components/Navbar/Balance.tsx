import EthPrice from 'components/Navbar/EthPrice'

import { ThemeContext } from 'contexts/themeContext'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import CurrencySymbol from 'components/CurrencySymbol'

export default function Balance({
  address,
  showEthPrice,
}: {
  address: string | undefined
  showEthPrice?: boolean
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { data: balance } = useEthBalanceQuery(address)

  return (
    <div
      style={{
        verticalAlign: 'middle',
        lineHeight: 1,
        color: colors.text.tertiary,
      }}
    >
      <CurrencySymbol currency="ETH" />
      {formatWad(balance, { precision: 4 }) ?? '--'}
      {showEthPrice && (
        <div style={{ color: colors.text.tertiary }}>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
