import { isAddress } from '@ethersproject/address'
import { Contract } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { NetworkContext } from 'contexts/networkContext'
import erc20Abi from 'erc-20-abi'
import { constants } from 'ethers'
import { useContext, useEffect, useState } from 'react'

export function useErc20Contract(address: string | undefined) {
  const [contract, setContract] = useState<Contract>()
  const { signingProvider } = useContext(NetworkContext)

  const provider = signingProvider ?? readProvider

  useEffect(() => {
    provider.listAccounts().then(accounts => {
      if (
        !address ||
        !isAddress(address) ||
        address === constants.AddressZero
      ) {
        setContract(undefined)
      } else if (!accounts.length) {
        setContract(new Contract(address, erc20Abi, readProvider))
      } else {
        setContract(new Contract(address, erc20Abi, provider.getSigner()))
      }
    })
  }, [address, provider])

  return contract
}
