import { namehash } from 'ethers/lib/utils'
import ENSRegistryData from 'hooks/ENS/contracts/ENSRegistry.json'
import ENSResolverData from 'hooks/ENS/contracts/PublicResolverAbi.json'
import { useLoadContractFromAddress } from 'hooks/useLoadContractFromAddress'
import useV2ContractReader from './contractReader/useV2ContractReader'

/**
 * Get the ENS Resolver contract for a specific ENS node
 * @param ensName name of ENS node, with or without .eth suffix
 * @returns ENS Resolver contract
 */
export function useResolverForENS(ensName: string | undefined) {
  const node = ensName
    ? namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))
    : undefined

  // Registry address is the same for both mainnet + sepolia
  const ENSRegistry = useLoadContractFromAddress({
    address: ENSRegistryData.address,
    abi: ENSRegistryData.abi,
  })

  const { data: resolverAddress } = useV2ContractReader<string>({
    contract: ENSRegistry,
    functionName: 'resolver',
    args: node ? [node] : null,
  })

  return useLoadContractFromAddress({
    address: resolverAddress,
    abi: ENSResolverData.abi,
  })
}
