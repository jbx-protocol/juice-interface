import { useJBChainId } from 'juice-sdk-react'
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia
} from 'viem/chains'
/**
 *
 * @todo add to sdk
 */
export function useNativeTokenSymbol() {
  const symbols: { [k: number]: string } = {
    [sepolia.id]: 'SepETH',
    [optimismSepolia.id]: 'OPSepETH',
    [arbitrumSepolia.id]: 'ArbSepETH',
    [baseSepolia.id]: 'BaseSepETH',
  }

  const chainId = useJBChainId()
  return symbols[chainId ?? 0] ?? 'ETH'
}
