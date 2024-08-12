import { JBChainId } from 'juice-sdk-react'
import {
  arbitrumSepolia,
  baseSepolia,
  optimismSepolia,
  sepolia,
} from 'viem/chains'

export const chainNameMap: Record<string, JBChainId> = {
  sepolia: sepolia.id,
  opsepolia: optimismSepolia.id,
  basesepolia: baseSepolia.id,
  arbsepolia: arbitrumSepolia.id,
}

export function getChainName(chainId: number) {
  return Object.entries(chainNameMap).find(([, id]) => id === chainId)?.[0]
}
