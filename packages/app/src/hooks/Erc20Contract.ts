import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { localProvider } from 'constants/local-provider'
import erc20Abi from 'erc-20-abi'
import { useMemo } from 'react'
import { addressExists } from 'utils/addressExists'

export function useErc20Contract(
  address?: string,
  providerOrSigner?: JsonRpcProvider | JsonRpcSigner,
) {
  return useMemo(
    () =>
      address && addressExists(address)
        ? new Contract(address, erc20Abi, providerOrSigner ?? localProvider)
        : undefined,
    [address, providerOrSigner],
  )
}
