import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import { Signer } from 'crypto'
import erc20Abi from 'erc-20-abi'
import { useMemo } from 'react'
import { addressExists } from 'utils/addressExists'

export function useErc20Contract(
  address: string | undefined,
  provider: JsonRpcProvider | undefined,
) {
  return useMemo(
    () =>
      address && addressExists(address)
        ? new Contract(address, erc20Abi, provider?.getSigner() ?? provider)
        : undefined,
    [address, Signer],
  )
}
