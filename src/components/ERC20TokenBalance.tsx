import useERC20BalanceOf from 'hooks/ERC20BalanceOf'
import useERC20DecimalsOf from 'hooks/ERC20DecimalsOf'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/format/formatNumber'

import FormattedAddress from 'components/FormattedAddress'

export default function ERC20TokenBalance({
  tokenAddress,
  wallet,
  style,
  precision,
}: {
  tokenAddress: string | undefined
  wallet: string | undefined
  style?: CSSProperties
  precision?: number
}) {
  const { data: balance } = useERC20BalanceOf(tokenAddress, wallet)
  const decimals = useERC20DecimalsOf(tokenAddress)
  const symbol = useSymbolOfERC20(tokenAddress)

  if (balance === undefined) return null

  return (
    <div style={style}>
      {formatWad(balance, {
        precision: precision ?? 0,
        decimals,
      })}{' '}
      <FormattedAddress label={symbol} address={tokenAddress} />
    </div>
  )
}
