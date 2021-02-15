import { Contract } from '@ethersproject/contracts'
import erc20Abi from 'erc-20-abi'

import { mainnetProvider } from '../constants/mainnet-provider'

export const erc20Contract = (address?: string) =>
  address
    ? new Contract(
        address,
        erc20Abi,
        mainnetProvider(process.env.REACT_APP_INFURA_NETWORK),
      )
    : undefined
