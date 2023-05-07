import { JB721DelegateContractsContext } from 'contexts/NftRewards/JB721DelegateContracts/JB721DelegateContractsContext'
import { JBTiered721Flags } from 'models/nftRewards'
import { useContext } from 'react'
import useV2ContractReader from '../../v2v3/contractReader/useV2ContractReader'

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
