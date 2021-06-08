import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { NetworkContext } from 'contexts/networkContext'
import erc20Abi from 'erc-20-abi'
import { constants } from 'ethers'
import { useContext, useMemo } from 'react'

export function useErc20Contract(address: string | undefined) {
  const { signingProvider } = useContext(NetworkContext)

  const provider = signingProvider ?? readProvider

  return useMemo(
    () =>
      address && isAddress(address) && address !== constants.AddressZero
        ? new Contract(address, erc20Abi, provider?.getSigner() ?? provider)
        : undefined,
    [address, provider],
  )
}
