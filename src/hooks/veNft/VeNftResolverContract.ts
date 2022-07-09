import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'

import { NetworkContext } from 'contexts/networkContext'

import * as constants from '@ethersproject/constants'
import { useContext, useEffect, useState } from 'react'

import { readProvider } from 'constants/readProvider'
import { veNftResolverAbi } from 'constants/v2/veNft/veNftResolverAbi'

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
        setContract(new Contract(address, veNftResolverAbi, readProvider))
      } else {
        setContract(
          new Contract(address, veNftResolverAbi, provider.getSigner()),
        )
      }
    })
  }, [address, signingProvider])

  return contract
}
