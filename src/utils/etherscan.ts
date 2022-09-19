import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'

export const etherscanLink = (type: 'tx' | 'address', hash: string) => {
  let subdomain = ''
  if (readNetwork.name !== NetworkName.mainnet) {
    subdomain = readNetwork.name + '.'
  }

  return `https://${subdomain}etherscan.io/${type}/${hash}`
}
