import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import erc20Abi from 'erc-20-abi'

import { localProvider } from '../constants/local-provider'

export const erc20Contract = (address?: string, provider?: JsonRpcProvider) =>
  address
    ? new Contract(address, erc20Abi, provider ?? localProvider)
    : undefined
