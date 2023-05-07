import { Trans } from '@lingui/macro'
import { generateAMMLink } from 'lib/amm'
import { useSushiswapPriceQuery } from './hooks/useERC20SushiswapPrice'
import { useUniswapPriceQuery } from './hooks/useERC20UniswapPrice'

import TokenAMMPriceRow from './TokenAMMPriceRow'

type Props = {
  mode: 'buy' | 'redeem'
  tokenSymbol: string
  tokenAddress: string
}

/**
 * Component for rendering a set of AMM Prices.
 */
export default function AMMPrices({ mode, tokenSymbol, tokenAddress }: Props) {
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
    <>
      <p className="text-xs">
        <Trans>Current 3rd Party Exchange Rates</Trans>
      </p>
      <TokenAMMPriceRow
        className="mb-2"
        exchangeName="Uniswap"
        tokenSymbol={tokenSymbol}
        exchangeLink={generateAMMLink({
          mode,
          baseLink: 'https://app.uniswap.org/#',
          tokenAddress,
        })}
        WETHPrice={uniswapPriceData?.WETHPrice.toFixed(0)}
        loading={uniswapLoading}
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
    </>
  )
}
