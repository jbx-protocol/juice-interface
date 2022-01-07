import { useUniswapPriceQuery } from 'hooks/ERC20UniswapPrice'
import { CSSProperties } from 'react'

import TokenAMMPriceBadge from './TokenAMMPriceBadge'

type Props = {
  tokenSymbol: string
  tokenAddress: string
  style: CSSProperties
}

/**
 * Component for rendering a set of AMM Prices.
 */
export default function AMMPrices({ tokenSymbol, tokenAddress, style }: Props) {
  const { data: uniswapPriceData, isLoading: uniswapLoading } =
    useUniswapPriceQuery({
      tokenSymbol,
      tokenAddress,
    })

  return (
    <div style={{ ...style }}>
      <TokenAMMPriceBadge
        exchangeName="Uniswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={`https://app.uniswap.org/#/swap?&inputCurrency=${tokenAddress}&outputCurrency=ETH`}
        WETHPrice={uniswapPriceData?.WETHPrice}
        loading={uniswapLoading}
      />
    </div>
  )
}
