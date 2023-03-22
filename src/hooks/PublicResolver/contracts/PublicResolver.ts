import { ContractInterface } from '@ethersproject/contracts'
import { readNetwork } from 'constants/networks'
import { useLoadContractFromAddress } from 'hooks/LoadContractFromAddress'
import { goerliPublicResolver } from 'hooks/PublicResolver/contracts/PublicResolverGoerli'
import { mainnetPublicResolver } from 'hooks/PublicResolver/contracts/PublicResolverMainnet'
import { NetworkName } from 'models/networkName'
import { useEffect, useState } from 'react'

export const loadPublicResolverContract = (network: NetworkName) => {
  // ENS contracts package currently doesn't include goerli information, and ABI contains errors
  if (network === NetworkName.mainnet) return mainnetPublicResolver
  if (network === NetworkName.goerli) return goerliPublicResolver
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
