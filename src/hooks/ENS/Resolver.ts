import { ContractInterface } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

async function loadPublicResolverContract(
  network: NetworkName,
): Promise<Omit<ContractJson, 'address'> | undefined> {
  // ENS contracts package currently doesn't include goerli information, and ABI contains errors
  if (network === NetworkName.mainnet)
    return await import('hooks/ENS/contracts/PublicResolverMainnet.json')
  if (network === NetworkName.goerli)
    return await import('hooks/ENS/contracts/PublicResolverGoerli.json')
}

export function useResolver(address: string | undefined) {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadPublicResolverContract(readNetwork.name)
      setAbi(json?.abi)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
