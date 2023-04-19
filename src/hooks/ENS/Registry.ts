import { ContractInterface } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

async function loadENSRegistryContract(
  network: NetworkName,
): Promise<ContractJson | undefined> {
  if (network === NetworkName.mainnet)
    return await import('hooks/ENS/contracts/ENSRegistryMainnet.json')
  if (network === NetworkName.goerli)
    return await import('hooks/ENS/contracts/ENSRegistryGoerli.json')
}

export function useENSRegistry() {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadENSRegistryContract(readNetwork.name)
      setAbi(json?.abi)
      setAddress(json?.address)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
