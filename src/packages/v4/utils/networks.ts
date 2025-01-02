import { JBChainId } from 'juice-sdk-react'
import { TESTNET_IDS } from 'constants/networks'

export const chainNameMap: Record<string, JBChainId> = {
  sepolia: 11_155_111, //sepolia.id,
  opsepolia: 11155420, // optimismSepolia.id,
  basesepolia: 84532, // baseSepolia.id,
  arbsepolia: 421_614, // arbitrumSepolia.id,
}

export function getChainName(chainId: number) {
  return Object.entries(chainNameMap).find(([, id]) => id === chainId)?.[0]
}

export function isTestnet(chainId: number) {
  return TESTNET_IDS.has(chainId)
}
