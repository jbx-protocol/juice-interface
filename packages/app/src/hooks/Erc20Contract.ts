import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/read-provider'
import erc20Abi from 'erc-20-abi'
import { NetworkName } from 'models/network-name'
import { useMemo } from 'react'
import { addressExists } from 'utils/addressExists'

export function useErc20Contract(
  address: string | undefined,
  network: NetworkName | undefined,
) {
  const provider = readProvider(network)

  return useMemo(
    () =>
      address && addressExists(address)
        ? new Contract(address, erc20Abi, provider)
        : undefined,
    [address, network, provider],
  )
}
