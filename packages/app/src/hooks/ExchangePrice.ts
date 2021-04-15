import { Fetcher, Route, Token, WETH } from '@uniswap/sdk'
import { DAI } from 'constants/tokens/dai'
import { useState } from 'react'
import { mainnetProvider } from 'utils/providers'

import { usePoller } from './Poller'

export function useExchangePrice() {
  const [price, setPrice] = useState<number>()

  /* 💵 get the price of ETH from 🦄 Uniswap: */
  const pollPrice = () => {
    async function getPrice() {
      if (process.env.NODE_ENV === 'development') {
        // TODO get eth price from contrat
        setPrice(1600)
        return
      }

      const token = new Token(1, DAI, 18, 'DAI')
      const pair = await Fetcher.fetchPairData(
        token,
        WETH[token.chainId],
        mainnetProvider,
      )
      const route = new Route([pair], WETH[token.chainId])
      setPrice(parseFloat(route.midPrice.toSignificant(6)))
    }
    getPrice()
  }
  usePoller(pollPrice, [], 30000)

  return price
}
