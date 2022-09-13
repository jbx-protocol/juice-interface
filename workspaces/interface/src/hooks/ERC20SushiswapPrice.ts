import { Contract } from '@ethersproject/contracts'
import { CurrencyAmount, Pair, Route, Token, WETH9 } from '@sushiswap/sdk'

import IUniswapV2PairABI from '@uniswap/v2-core/build/IUniswapV2Pair.json'

import { useQuery } from 'react-query'

import { readNetwork } from 'constants/networks'

import { WAD_DECIMALS } from 'constants/numbers'
import { readProvider } from 'constants/readProvider'

/**
 * Fetches information about a pair and constructs a pair from the given two tokens.
 * @param tokenA first token
 * @param tokenB second token
 * @param provider the provider to use to fetch the data
 * Source: https://github.com/Uniswap/v2-sdk/blob/a88048e9c4198a5bdaea00883ca00c8c8e582605/src/fetcher.ts
 */
async function fetchPairData(tokenA: Token, tokenB: Token): Promise<Pair> {
  const pairAddress = Pair.getAddress(tokenA, tokenB)

  const [reserves0, reserves1] = await new Contract(
    pairAddress,
    IUniswapV2PairABI.abi,
    readProvider,
  ).getReserves()

  const balances = tokenA.sortsBefore(tokenB)
    ? [reserves0, reserves1]
    : [reserves1, reserves0]
  return new Pair(
    CurrencyAmount.fromRawAmount(tokenA, balances[0]),
    CurrencyAmount.fromRawAmount(tokenB, balances[1]),
  )
}

type Props = {
  tokenSymbol: string
  tokenAddress: string
}

const networkId = readNetwork.chainId

export function useSushiswapPriceQuery({ tokenSymbol, tokenAddress }: Props) {
  const PROJECT_TOKEN = new Token(
    networkId,
    tokenAddress,
    WAD_DECIMALS,
    tokenSymbol,
  )
  const WETH = WETH9[networkId]

  return useQuery([`${tokenSymbol}-sushiswap-price`], async () => {
    // note that you may want/need to handle this async code differently,
    // for example if top-level await is not an option
    const pair = await fetchPairData(PROJECT_TOKEN, WETH)

    const route = new Route([pair], WETH, PROJECT_TOKEN)
    return {
      tokenSymbol,
      midPrice: route.midPrice,
    }
  })
}
