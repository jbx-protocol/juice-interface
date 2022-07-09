import { VENFT_CONTRACT_ADDRESS } from 'constants/v2/veNft/veNftProject'

import useV2ContractReader from '../v2/contractReader/V2ContractReader'
import { useNFTContract } from './VeNftContract'

export function useNFTResolverAddress() {
  return useV2ContractReader<string>({
    contract: useNFTContract(VENFT_CONTRACT_ADDRESS),
    functionName: 'uriResolver',
  })
}
