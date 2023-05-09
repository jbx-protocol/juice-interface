import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { useContext } from 'react'
import useV2ContractReader from '../../v2v3/contractReader/useV2ContractReader'

export function useNftCollectionMetadataUri(
  dataSourceAddress: string | undefined,
) {
  const {
    contracts: { JB721TieredDelegateStore },
  } = useContext(JB721DelegateContractsContext)

  return useV2ContractReader<string>({
    contract: JB721TieredDelegateStore,
    functionName: 'contractUriOf',
    args: [dataSourceAddress],
  })
}
