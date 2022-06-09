import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectHandle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBProjectHandles,
    functionName: 'handleOf',
    args: projectId ? [projectId] : null,
  })
}
