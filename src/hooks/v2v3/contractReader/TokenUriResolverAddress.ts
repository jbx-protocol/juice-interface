import { V2V3ContractName } from 'models/v2v3/contracts'
import useV2ContractReader from './useV2ContractReader'

export default function useTokenUriResolverAddress() {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBProjects,
    functionName: 'tokenUriResolver',
  })
}
