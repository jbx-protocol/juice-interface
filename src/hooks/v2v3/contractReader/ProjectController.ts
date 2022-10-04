import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectController({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBDirectory,
    functionName: 'controllerOf',
    args: projectId ? [projectId] : null,
  })
}
