import EthPrice from 'components/Navbar/EthPrice'
import { ThemeContext } from 'contexts/themeContext'
import { useEthBalance } from 'hooks/EthBalance'
import { useContext } from 'react'
import { formatWad } from 'utils/formatNumber'

import CurrencySymbol from '../shared/CurrencySymbol'

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

  const balance = useEthBalance(address)

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
