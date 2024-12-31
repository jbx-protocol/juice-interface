import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import useV2ContractReader from './useV2ContractReader'

export default function useProjectControllerAddress({
  projectId,
}: {
  projectId: number | undefined
}) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBDirectory,
    functionName: 'controllerOf',
    args: projectId ? [projectId] : null,
  })
}
