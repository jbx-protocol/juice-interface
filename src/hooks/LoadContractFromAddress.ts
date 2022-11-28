import * as constants from '@ethersproject/constants'
import { Contract, ContractInterface } from '@ethersproject/contracts'
import { readProvider } from 'constants/readProvider'
import { isAddress } from 'ethers/lib/utils'
import { useEffect, useState } from 'react'
import { useWallet } from './Wallet'

export const useLoadContractFromAddress = <ABI extends ContractInterface>({
  address,
  abi,
}: {
  address: string | undefined
  abi: ABI | undefined
}) => {
  const [contract, setContract] = useState<Contract>()

  const { signer } = useWallet()

  const isInputAddressValid = (
    address: string | undefined,
  ): address is string => {
    if (address && isAddress(address) && address !== constants.AddressZero) {
      return true
    }
    return false
  }

  useEffect(() => {
    if (!abi || !isInputAddressValid(address)) {
      return setContract(undefined)
    }

    setContract(new Contract(address, abi, signer ?? readProvider))
  }, [address, abi, signer])

  return contract
}
