import EthPrice from 'components/Navbar/EthPrice'

import { ThemeContext } from 'contexts/themeContext'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useContext } from 'react'

import ETHAmount from 'components/currency/ETHAmount'

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
      <ETHAmount amount={balance} fallback="--" />

      {showEthPrice && (
        <div style={{ color: colors.text.tertiary }}>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
