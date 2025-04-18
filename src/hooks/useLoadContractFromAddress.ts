import { Contract, ContractInterface } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'

const isInputAddressValid = (
  address: string | undefined,
): address is string => {
  if (address && isAddress(address) && !isZeroAddress(address)) {
    return true
  }
  return false
}

export const useLoadContractFromAddress = <ABI extends ContractInterface>({
  address,
  abi,
}: {
  address: string | undefined
  abi: ABI | undefined
}) => {
  const [contract, setContract] = useState<Contract>()

  useEffect(() => {
    if (!abi || !isInputAddressValid(address)) {
      return setContract(undefined)
    }

    setContract(new Contract(address, abi, readProvider))
  }, [address, abi])

  return contract
}
