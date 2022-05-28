import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectTerminals({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string[]>({
    contract: V2ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId] : null,
  })
}
