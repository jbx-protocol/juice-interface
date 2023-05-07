import { readProvider } from 'constants/readProvider'
import { Contract, ContractInterface } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import { useWallet } from './Wallet'

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

  const { signer } = useWallet()

  useEffect(() => {
    if (!abi || !isInputAddressValid(address)) {
      return setContract(undefined)
    }

    setContract(new Contract(address, abi, signer ?? readProvider))
  }, [address, abi, signer])

  return contract
}
