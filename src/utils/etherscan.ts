import { NETWORKS, readNetwork } from 'constants/networks'
import { JBChainId } from 'juice-sdk-core'
import { NetworkName } from 'models/networkName'

export const etherscanLink = (
  type: 'tx' | 'address',
  hash: string,
  chainId?: JBChainId,
) => {
  if (chainId && NETWORKS[chainId]) {
    return `${NETWORKS[chainId].blockExplorer}/${type}/${hash}`
  }

  let subdomain = ''

  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }

  return `https://${subdomain}etherscan.io/${type}/${hash}`
}
