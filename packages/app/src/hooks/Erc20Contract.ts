import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider, JsonRpcSigner } from '@ethersproject/providers'
import { readProvider } from 'constants/read-provider'
import { UserContext } from 'contexts/userContext'
import erc20Abi from 'erc-20-abi'
import { useContext, useMemo } from 'react'
import { addressExists } from 'utils/addressExists'

export function useErc20Contract(
  address?: string,
  providerOrSigner?: JsonRpcProvider | JsonRpcSigner,
) {
  const { network } = useContext(UserContext)

  return useMemo(
    () =>
      address && addressExists(address)
        ? new Contract(
            address,
            erc20Abi,
            providerOrSigner ?? readProvider(network),
          )
        : undefined,
    [address, providerOrSigner, network],
  )
}
