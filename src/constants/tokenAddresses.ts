import { NetworkName } from 'models/network-name'

type TokenAddressNames = 'V1TicketBooth' | 'V2TokenStore' | 'V3TokenStore'

export const TokenAddresses: {
  [addressName in TokenAddressNames]: {
    [networkName in NetworkName]?: string | null
  }
} = {
  V1TicketBooth: {
    mainnet: '0xee2eBCcB7CDb34a8A822b589F9E8427C24351bfc',
    goerli: null,
  },
  V2TokenStore: {
    mainnet: '0xCBB8e16d998161AdB20465830107ca298995f371',
    goerli: '0x33265D9eaD1291FAA981a177278dF8053aF24221',
  },
  V3TokenStore: {
    mainnet: '0x6FA996581D7edaABE62C15eaE19fEeD4F1DdDfE7',
    goerli: '0x1246a50e3aDaF684Ac566f0c40816fF738F309B3',
  },
}
