import { useJB721TieredDelegate } from 'hooks/contracts/JB721Delegate/useJB721TieredDelegate'

import useV2ContractReader from '../../v2v3/contractReader/V2ContractReader'

export function useNftCollectionSymbol(dataSourceAddress: string | undefined) {
  const delegateContract = useJB721TieredDelegate({
    address: dataSourceAddress,
  })
  return useV2ContractReader<string>({
    contract: delegateContract,
    functionName: 'symbol',
    args: [],
  })
}
