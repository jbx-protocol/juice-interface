import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './useV2ContractReader'

export default function useProjectTerminals({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string[]>({
    contract: V2V3ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId] : null,
  })
}
