import useERC20BalanceOf from 'hooks/ERC20/useERC20BalanceOf'
import useERC20DecimalsOf from 'hooks/ERC20/useERC20DecimalsOf'
import useSymbolOfERC20 from 'hooks/ERC20/useSymbolOfERC20'

import { TokenAmount } from './TokenAmount'

export default function ERC20TokenBalance({
  tokenAddress,
  wallet,
}: {
  tokenAddress: string | undefined
  wallet: string | undefined
}) {
  const { data: balance } = useERC20BalanceOf(tokenAddress, wallet)
  const decimals = useERC20DecimalsOf(tokenAddress)
  const { data: symbol } = useSymbolOfERC20(tokenAddress)

  if (balance === undefined) return null

  return (
    <div>
      <TokenAmount
        amountWad={balance}
        tokenSymbol={symbol}
        decimals={decimals}
      />
    </div>
  )
}
