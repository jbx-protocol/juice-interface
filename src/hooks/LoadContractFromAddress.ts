import { isAddress } from 'ethers/lib/utils'
import { useState, useEffect } from 'react'
import { useSigner, useProvider } from 'wagmi'
import { Contract } from '@ethersproject/contracts'
import { ContractInterface } from '@ethersproject/contracts'
import * as constants from '@ethersproject/constants'

export const useLoadContractFromAddress = <ABI extends ContractInterface>({
  address,
  abi,
}: {
  address: string | undefined
  abi: ABI
}) => {
  const [contract, setContract] = useState<Contract>()

  const { data: signer } = useSigner()
  const provider = useProvider()

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
