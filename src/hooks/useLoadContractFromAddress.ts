import { readProvider } from 'constants/readProvider'
import { Contract, ethers } from 'ethers'
import { useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { useWallet } from './Wallet'

const isInputAddressValid = (
  address: string | undefined,
): address is string => {
  if (address && ethers.isAddress(address) && !isZeroAddress(address)) {
    return true
  }
  return false
}

export const useLoadContractFromAddress = <
  ABI extends ethers.InterfaceAbi | ethers.Interface,
>({
  address,
  abi,
}: {
  address: string | undefined
  abi: ABI | undefined
}) => {
  const [contract, setContract] = useState<Contract>()

  const { signer } = useWallet()

  useEffect(() => {
    if (!abi || !isInputAddressValid(address)) {
      return setContract(undefined)
    }

    setContract(new Contract(address, abi, signer ?? readProvider))
  }, [address, abi, signer])

  return contract
}
