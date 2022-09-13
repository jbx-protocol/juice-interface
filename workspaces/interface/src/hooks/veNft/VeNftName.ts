import useV2ContractReader from 'hooks/v2/contractReader/V2ContractReader'
import { useVeNftContract } from 'hooks/veNft/VeNftContract'

export function useVeNftName() {
  return useV2ContractReader<string>({
    contract: useVeNftContract(),
    functionName: 'name',
  })
}
