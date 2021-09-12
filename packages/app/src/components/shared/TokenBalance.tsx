import { useERC20TokenBalance } from 'hooks/ERC20TokenBalance'
import { TokenRef } from 'models/token-ref'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'

export default function TokenBalance({
  token,
  wallet,
  style,
  decimals,
}: {
  token: TokenRef | undefined
  wallet: string | undefined
  style?: CSSProperties
  decimals?: number
}) {
  const balance = useERC20TokenBalance(wallet, token?.address)

  if (balance === undefined || !token) return null

  return (
    <div style={style}>
      {formatWad(balance, { decimals: decimals ?? 0 })} {token.symbol}
    </div>
  )
}
