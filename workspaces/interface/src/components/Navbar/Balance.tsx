import EthPrice from 'components/Navbar/EthPrice'

import { ThemeContext } from 'contexts/themeContext'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { useContext } from 'react'

import ETHAmount from 'components/currency/ETHAmount'

export default function Balance({
  address,
  showEthPrice,
  hideTooltip,
}: {
  address: string | undefined
  showEthPrice?: boolean
  hideTooltip?: boolean
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
      <ETHAmount amount={balance} fallback="--" hideTooltip={hideTooltip} />

      {showEthPrice && (
        <div style={{ color: colors.text.tertiary }}>
          <EthPrice />
        </div>
      )}
    </div>
  )
}
