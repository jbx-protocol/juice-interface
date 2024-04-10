import { readNetwork } from 'constants/networks'
import { ContractInterface } from 'ethers'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

async function loadENSRegistryContract(): Promise<ContractJson | undefined> {
  const { name } = readNetwork

  if (
    name === NetworkName.mainnet ||
    name === NetworkName.goerli ||
    name === NetworkName.sepolia
  ) {
    // Registry address is the same for both mainnet + goerli + sepolia
    return await import('hooks/ENS/contracts/ENSRegistry.json')
  }
}

export function useENSRegistry() {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadENSRegistryContract()
      setAbi(json?.abi)
      setAddress(json?.address)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
