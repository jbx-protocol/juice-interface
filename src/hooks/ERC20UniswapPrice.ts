import { Pool } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import { useQuery } from 'react-query'
import { BigNumber } from '@ethersproject/bignumber'
import { Contract } from '@ethersproject/contracts'
import { abi as IUniswapV3PoolABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { abi as IUniswapV3FactoryABI } from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'

import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'

interface Immutables {
  factory: string
  token0: string
  token1: string
  fee: number
  tickSpacing: number
  maxLiquidityPerTick: BigNumber
}

interface State {
  liquidity: BigNumber
  sqrtPriceX96: BigNumber
  tick: number
  observationIndex: number
  observationCardinality: number
  observationCardinalityNext: number
  feeProtocol: number
  unlocked: boolean
}

type Props = {
  tokenSymbol: string
  tokenAddress: string
}

// https://docs.uniswap.org/protocol/reference/deployments
const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const WETH_ADDRESS = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const UNISWAP_FEE = 10000
const networkId = readNetwork.chainId
const wadPrecision = 18

export function useUniswapPriceQuery({ tokenSymbol, tokenAddress }: Props) {
  const factoryContract = new Contract(
    UNISWAP_V3_FACTORY_ADDRESS,
    IUniswapV3FactoryABI,
    readProvider,
  )

  // TODO cache probably
  const getPoolAddress = async () => {
    return await factoryContract.getPool(
      tokenAddress,
      WETH_ADDRESS,
      UNISWAP_FEE,
    )
  }

  async function getPoolImmutables(poolContract: Contract) {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
      await Promise.all([
        poolContract.factory(),
        poolContract.token0(),
        poolContract.token1(),
        poolContract.fee(),
        poolContract.tickSpacing(),
        poolContract.maxLiquidityPerTick(),
      ])

    const immutables: Immutables = {
      factory,
      token0,
      token1,
      fee,
      tickSpacing,
      maxLiquidityPerTick,
    }
    return immutables
  }

  async function getPoolState(poolContract: Contract) {
    const [slot, liquidity] = await Promise.all([
      poolContract.slot0(),
      poolContract.liquidity(),
    ])
    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    }
    return PoolState
  }

  return useQuery(
    [`${tokenSymbol}-uniswap-price`],
    async () => {
      try {
        const poolAddress = await getPoolAddress()

        const poolContract = new Contract(
          poolAddress,
          IUniswapV3PoolABI,
          readProvider,
        )

        const [immutables, state] = await Promise.all([
          getPoolImmutables(poolContract),
          getPoolState(poolContract),
        ])

        const PROJECT_TOKEN = new Token(
          networkId,
          immutables.token0,
          wadPrecision,
          tokenSymbol,
        )
        const WETH = new Token(
          networkId,
          immutables.token1,
          wadPrecision,
          'WETH',
        )

        const projectTokenETHPool = new Pool(
          PROJECT_TOKEN,
          WETH,
          immutables.fee,
          state.sqrtPriceX96.toString(),
          state.liquidity.toString(),
          state.tick,
        )

        const projectTokenPrice = projectTokenETHPool.token0Price
        const WETHPrice = projectTokenETHPool.token1Price
        return {
          tokenSymbol,
          projectTokenPrice,
          WETHPrice,
          liquidity: projectTokenETHPool.liquidity.toString(),
        }
      } catch (e) {
        console.error('Error fetching AMM price', e)
      }
    },
    {
      refetchInterval: 30000,
    },
  )
}
