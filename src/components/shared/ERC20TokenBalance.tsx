import useClaimedBalanceOfUser from 'hooks/contractReader/ClaimedBalanceOfUser'
import useDecimalsOfERC20 from 'hooks/contractReader/DecimalsOfERC20'
import useSymbolOfERC20 from 'hooks/contractReader/SymbolOfERC20'
import { CSSProperties } from 'react'
import { formatWad } from 'utils/formatNumber'

import FormattedAddress from './FormattedAddress'

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
  const balance = useClaimedBalanceOfUser(tokenAddress, wallet)
  const decimals = useDecimalsOfERC20(tokenAddress)
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
