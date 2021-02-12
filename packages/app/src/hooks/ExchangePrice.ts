import { JsonRpcProvider } from '@ethersproject/providers'
import { Fetcher, Route, Token, WETH } from '@uniswap/sdk'
import { useState } from 'react'

import { DAI } from '../constants/tokens/dai'
import { usePoller } from './Poller'

export function useExchangePrice(
  mainnetProvider: JsonRpcProvider,
  pollTime = 10000,
) {
  const [price, setPrice] = useState(0)

  /* 💵 get the price of ETH from 🦄 Uniswap: */
  const pollPrice = () => {
    async function getPrice() {
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
  usePoller(pollPrice, pollTime)

  return price
}
