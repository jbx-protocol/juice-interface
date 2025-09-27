import { TESTNET_IDS } from 'constants/networks'
import { JB_CHAINS, JBChainId } from 'juice-sdk-core'

export function getChainName(chainId: number) {
  return JB_CHAINS[chainId as JBChainId].name
}

export function getChainSlug(chainId: number) {
  return JB_CHAINS[chainId as JBChainId].slug
}

export function isTestnet(chainId: number) {
  return TESTNET_IDS.has(chainId)
}
