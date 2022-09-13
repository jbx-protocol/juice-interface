import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader from './V3ContractReader'

export default function useProjectTerminals({
  projectId,
}: {
  projectId?: number
}) {
  return useV3ContractReader<string[]>({
    contract: V3ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId] : null,
  })
}
