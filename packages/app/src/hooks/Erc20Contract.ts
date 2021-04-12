import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { JsonRpcProvider } from '@ethersproject/providers'
import erc20Abi from 'erc-20-abi'
import { useMemo } from 'react'

export function useErc20Contract(
  address: string | undefined,
  provider: JsonRpcProvider | undefined,
) {
  return useMemo(
    () =>
      address && isAddress(address)
        ? new Contract(address, erc20Abi, provider?.getSigner() ?? provider)
        : undefined,
    [address, provider],
  )
}
