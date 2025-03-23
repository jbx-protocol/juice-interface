import { readNetwork } from 'constants/networks'
import { JB_CHAINS, JBChainId } from 'juice-sdk-core'
import { NetworkName } from 'models/networkName'

export const etherscanLink = (
  type: 'tx' | 'address',
  hash: string,
  chainId?: JBChainId,
) => {
  if (chainId) {
    return `https://${JB_CHAINS[chainId].etherscanHostname}/${type}/${hash}`
  }

  let subdomain = ''

  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }

  return `https://${subdomain}etherscan.io/${type}/${hash}`
}
