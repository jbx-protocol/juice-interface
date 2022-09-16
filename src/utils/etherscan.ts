import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/network-name'

export const etherscanLinkForTxHash = (hash: string) =>
  `https://${readNetwork.name}${
    readNetwork.name !== NetworkName.mainnet ? '.' : ''
  }etherscan.io/tx/${hash}`
