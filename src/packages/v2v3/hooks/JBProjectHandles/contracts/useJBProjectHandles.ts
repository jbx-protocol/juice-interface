import { readNetwork } from 'constants/networks'
import { ContractInterface } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { useEffect, useState } from 'react'
import { loadJBProjectHandlesContract } from './loadJBProjectHandles'

export function useJBProjectHandles() {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadJBProjectHandlesContract(readNetwork.name)
      setAbi(json.abi)
      setAddress(json.address)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
