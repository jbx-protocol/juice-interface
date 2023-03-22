import { ContractInterface } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { ContractJson } from 'models/contracts'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

async function loadPublicResolverContract(network: NetworkName) {
  // ENS contracts package currently doesn't include goerli information, and ABI contains errors
  if (network === NetworkName.mainnet)
    return (await import(
      'hooks/PublicResolver/contracts/PublicResolverMainnet.json'
    )) as ContractJson
  if (network === NetworkName.goerli)
    return (await import(
      'hooks/PublicResolver/contracts/PublicResolverGoerli.json'
    )) as ContractJson
}

export function usePublicResolver() {
  const [abi, setAbi] = useState<ContractInterface | undefined>(undefined)
  const [address, setAddress] = useState<string | undefined>(undefined)

  useEffect(() => {
    async function load() {
      const json = await loadPublicResolverContract(readNetwork.name)
      setAbi(json?.abi)
      setAddress(json?.address)
    }
    load()
  }, [])

  return useLoadContractFromAddress({ address, abi })
}
