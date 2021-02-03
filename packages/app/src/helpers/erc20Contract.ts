import { Contract } from '@ethersproject/contracts'
import erc20Abi from 'erc-20-abi'

import { localProvider } from '../constants/local-provider'

export const erc20Contract = (address?: string) =>
  address ? new Contract(address, erc20Abi, localProvider) : undefined
