import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import erc20Abi from 'erc-20-abi'

export const erc20Contract = (address?: string, provider?: JsonRpcProvider) =>
  address && provider ? new Contract(address, erc20Abi, provider) : undefined
