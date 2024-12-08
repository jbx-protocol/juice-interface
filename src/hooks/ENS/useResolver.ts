import { ContractInterface } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { useEffect, useState } from 'react'

async function loadPublicResolverContractAbi(): Promise<
  Omit<ContractJson, 'address'> | undefined
> {
  return await import('hooks/ENS/contracts/PublicResolverAbi.json')
}

export function useResolver(address: string | undefined) {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadPublicResolverContractAbi()
      setAbi(json?.abi)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
