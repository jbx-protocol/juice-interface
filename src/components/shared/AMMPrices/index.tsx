import { useUniswapPriceQuery } from 'hooks/ERC20UniswapPrice'
import { useSushiswapPriceQuery } from 'hooks/ERC20SushiswapPrice'
import { CSSProperties } from 'react'

import TokenAMMPriceRow from './TokenAMMPriceRow'

type Props = {
  tokenSymbol: string
  tokenAddress: string
  style?: CSSProperties
}

/**
 * Component for rendering a set of AMM Prices.
 */
export default function AMMPrices({
  tokenSymbol,
  tokenAddress,
  style = {},
}: Props) {
  const { data: uniswapPriceData, isLoading: uniswapLoading } =
    useUniswapPriceQuery({
      tokenSymbol,
      tokenAddress,
    })

  const { data: sushiswapPriceData, isLoading: sushiswapLoading } =
    useSushiswapPriceQuery({
      tokenSymbol,
      tokenAddress,
    })

  return (
    <div style={{ ...style }}>
      <TokenAMMPriceRow
        exchangeName="Uniswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={`https://app.uniswap.org/#/swap?inputCurrency=${tokenAddress}&outputCurrency=ETH`}
        WETHPrice={uniswapPriceData?.WETHPrice.toFixed(0)}
        loading={uniswapLoading}
        style={{ marginBottom: '0.5rem' }}
      />
      <TokenAMMPriceRow
        exchangeName="Sushiswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={`https://app.sushi.com/swap?inputCurrency=${tokenAddress}&outputCurrency=ETH`}
        WETHPrice={sushiswapPriceData?.midPrice.toFixed(0)}
        loading={sushiswapLoading}
      />
    </div>
  )
}
