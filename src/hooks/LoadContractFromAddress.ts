import * as constants from '@ethersproject/constants'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'

import { useWallet } from './Wallet'

export const useLoadContractFromAddress = <ABI extends ContractInterface>({
  address,
  abi,
}: {
  address: string | undefined
  abi: ABI
}) => {
  const [contract, setContract] = useState<Contract>()

  const { signer, provider } = useWallet()

  const isInputAddressValid = (
    address: string | undefined,
  ): address is string => {
    if (address && isAddress(address) && address !== constants.AddressZero) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (!isInputAddressValid(address)) {
      return setContract(undefined)
    }

    setContract(new Contract(address, abi, signer ?? provider))
  }, [address, abi, signer, provider])

  return contract
}
