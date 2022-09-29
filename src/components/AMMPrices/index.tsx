import { Trans } from '@lingui/macro'
import { useSushiswapPriceQuery } from 'hooks/ERC20SushiswapPrice'
import { useUniswapPriceQuery } from 'hooks/ERC20UniswapPrice'
import { generateAMMLink } from 'lib/amm'
import { CSSProperties } from 'react'

import TokenAMMPriceRow from './TokenAMMPriceRow'

type Props = {
  mode: 'buy' | 'redeem'
  tokenSymbol: string
  tokenAddress: string
  style?: CSSProperties
}

/**
 * Component for rendering a set of AMM Prices.
 */
export default function AMMPrices({
  mode,
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
      <p style={{ fontSize: '0.7rem' }}>
        <Trans>Current 3rd Party Exchange Rates</Trans>
      </p>
      <TokenAMMPriceRow
        exchangeName="Uniswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={generateAMMLink({
          mode,
          baseLink: 'https://app.uniswap.org/#',
          tokenAddress,
        })}
        WETHPrice={uniswapPriceData?.WETHPrice.toFixed(0)}
        loading={uniswapLoading}
        style={{ marginBottom: '0.5rem' }}
      />
      <TokenAMMPriceRow
        exchangeName="Sushiswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={generateAMMLink({
          mode,
          baseLink: 'https://app.sushi.com',
          tokenAddress,
        })}
        WETHPrice={sushiswapPriceData?.midPrice.toFixed(0)}
        loading={sushiswapLoading}
      />
    </div>
  )
}
