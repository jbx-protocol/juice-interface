import { JsonRpcProvider } from '@ethersproject/providers'

export const mainnetProvider = (network: string = 'mainnet') =>
  new JsonRpcProvider(
    `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_ID}`,
  )
