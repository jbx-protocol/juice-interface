import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

import { VENFT_CONTRACT_ADDRESS } from 'constants/veNft/veNftProject'

export function useVeNftResolverAddress() {
  return useV2ContractReader<string>({
    contract: useVeNftContract(VENFT_CONTRACT_ADDRESS),
    functionName: 'uriResolver',
  })
}
