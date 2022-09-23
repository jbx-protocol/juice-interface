import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectToken({ projectId }: { projectId?: number }) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId] : null,
  })
}
