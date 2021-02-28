import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import erc20Abi from 'erc-20-abi'

import { localProvider } from '../constants/local-provider'
import { addressExists } from './addressExists'

export const erc20Contract = (
  address?: string,
  providerOrSigner?: JsonRpcProvider | JsonRpcSigner,
) =>
  address && addressExists(address)
    ? new Contract(address, erc20Abi, providerOrSigner ?? localProvider)
    : undefined
