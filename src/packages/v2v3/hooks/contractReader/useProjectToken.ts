import { V2V3ContractName } from 'packages/v2v3/models/contracts'

import useV2ContractReader from './useV2ContractReader'

export default function useProjectToken({ projectId }: { projectId?: number }) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId] : null,
  })
}
