import { NetworkName } from 'models/network-name'

export const getEtherscanBaseUrl = (networkName: NetworkName): string => {
  let subdomain = ''
  if (networkName !== NetworkName.mainnet) {
    subdomain = networkName + '.'
  }
  return `https://${subdomain}etherscan.io`
}

export const getEtherscanApiUrl = (networkName: NetworkName): string => {
  let extra = ''
  if (networkName !== NetworkName.mainnet) {
    extra = `-${networkName}`
  }

  return `https://api${extra}.etherscan.io`
}
