import { JBChainId } from 'juice-sdk-react'

export const chainNameMap: Record<string, JBChainId> = {
  sepolia: 11_155_111, //sepolia.id,
  opsepolia: 11155420, // optimismSepolia.id,
  basesepolia: 84532, // baseSepolia.id,
  arbsepolia: 421_614, // arbitrumSepolia.id,
}

export function getChainName(chainId: number) {
  return Object.entries(chainNameMap).find(([, id]) => id === chainId)?.[0]
}
