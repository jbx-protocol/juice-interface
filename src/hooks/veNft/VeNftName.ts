import useV2ContractReader from 'hooks/v2v3/contractReader/V2ContractReader'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export function useVeNftName() {
  return useV2ContractReader<string>({
    contract: useVeNftContract(),
    functionName: 'name',
  })
}
