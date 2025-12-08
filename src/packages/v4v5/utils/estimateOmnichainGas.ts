import { Abi, Address, Client, encodeFunctionData, PublicClient, Transport } from 'viem'
import { estimateGas } from 'viem/actions'
import { JBChainId } from 'juice-sdk-core'
import { wagmiConfig } from 'contexts/Para/Providers'
import { Chain } from 'viem/chains'

const GAS_BUFFER_PERCENT = 120n // 20% buffer

/**
 * Fallback gas values per operation type.
 * These are based on the original hardcoded values in the codebase,
 * used when dynamic estimation fails.
 */
export const OMNICHAIN_GAS_FALLBACKS = {
  SET_URI: 200_000n,
  QUEUE_RULESETS: 200_000n,
  DEPLOY_ERC20: 300_000n,
  TRANSFER_OWNERSHIP: 300_000n,
  LAUNCH_PROJECT: 1_000_000n,
  LAUNCH_NFT_PROJECT: 3_000_000n,
} as const

export type EstimateGasParams = {
  chainId: JBChainId
  contractAddress: Address
  abi: Abi
  functionName: string
  args: readonly unknown[]
  userAddress: Address
  fallbackGas: bigint
}

/**
 * Estimates gas for a contract call on a specific chain.
 * Applies a 20% buffer to the estimate.
 * Falls back to the provided fallbackGas value if estimation fails.
 */
export async function estimateContractGasWithFallback({
  chainId,
  contractAddress,
  abi,
  functionName,
  args,
  userAddress,
  fallbackGas,
}: EstimateGasParams): Promise<bigint> {
  try {
    const client = wagmiConfig.getClient({ chainId }) as Client<Transport, Chain>

    const data = encodeFunctionData({
      abi,
      functionName,
      args,
    })

    const gasEstimate = await estimateGas(client as PublicClient, {
      to: contractAddress,
      data,
      account: userAddress as Address,
    })

    // Apply 20% buffer
    return (gasEstimate * GAS_BUFFER_PERCENT) / 100n
  } catch {
    // Silent fallback to default gas value
    return fallbackGas
  }
}

/**
 * Estimates gas for multiple chains in parallel.
 * Each chain estimation is independent and uses its own fallback.
 */
export async function estimateGasForChains(
  chainEstimates: EstimateGasParams[],
): Promise<Map<JBChainId, bigint>> {
  const results = await Promise.all(
    chainEstimates.map(async (params) => {
      const gas = await estimateContractGasWithFallback(params)
      return { chainId: params.chainId, gas }
    }),
  )

  return new Map(results.map(({ chainId, gas }) => [chainId, gas]))
}
