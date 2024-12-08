import { namehash } from 'ethers/lib/utils'
import { useENSRegistry } from 'hooks/ENS/useRegistry'
import { useResolver } from 'hooks/ENS/useResolver'
import useV2ContractReader from './contractReader/useV2ContractReader'

/**
 * Get the ENS Resolver contract for a specific ENS node
 * @param ensName name of ENS node, with or without .eth suffix
 * @returns ENS Resolver contract
 */
export function useResolverForENS(ensName: string | undefined) {
  const ENSRegistry = useENSRegistry()

  const node = ensName
    ? namehash(ensName + (ensName.endsWith('.eth') ? '' : '.eth'))
    : undefined

  const { data: resolverAddress } = useV2ContractReader<string>({
    contract: ENSRegistry,
    functionName: 'resolver',
    args: node ? [node] : null,
  })

  return useResolver(resolverAddress)
}
