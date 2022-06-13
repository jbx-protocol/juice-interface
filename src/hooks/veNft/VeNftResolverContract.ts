import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'

import { NetworkContext } from 'contexts/networkContext'

import * as constants from '@ethersproject/constants'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { veBannyResolverABI } from 'constants/v2/nft/veBannyResolverABI'

export function useNFTResolverContract(address: string | undefined) {
  const [contract, setContract] = useState<Contract>()
  const { signingProvider } = useContext(NetworkContext)

  useEffect(() => {
    const provider = signingProvider ?? readProvider

    provider.listAccounts().then(accounts => {
      if (
        !address ||
        !isAddress(address) ||
        address === constants.AddressZero
      ) {
        setContract(undefined)
      } else if (!accounts.length) {
        setContract(new Contract(address, veBannyResolverABI, readProvider))
      } else {
        setContract(
          new Contract(address, veBannyResolverABI, provider.getSigner()),
        )
      }
    })
  }, [address, signingProvider])

  return contract
}
