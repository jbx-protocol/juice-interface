import { JBTiered721Flags } from 'models/nftRewards'
import { JB721DelegateContractsContext } from 'packages/v2v3/contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import useV2ContractReader from 'packages/v2v3/hooks/contractReader/useV2ContractReader'
import { useContext } from 'react'

export function useNftFlagsOf(dataSourceAddress: string | undefined) {
  const {
    contracts: { JB721TieredDelegateStore },
  } = useContext(JB721DelegateContractsContext)

  return useV2ContractReader<JBTiered721Flags>({
    contract: JB721TieredDelegateStore,
    functionName: 'flagsOf',
    args: [dataSourceAddress],
  })
}
