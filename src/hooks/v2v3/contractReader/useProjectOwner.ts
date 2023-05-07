import { V2V3ContractName } from 'models/v2v3/contracts'
import useContractReader from './useV2ContractReader'

/** Returns address of project owner. */
export default function useProjectOwner(projectId: number | undefined) {
  return useContractReader<string>({
    contract: V2V3ContractName.JBProjects,
    functionName: 'ownerOf',
    args: projectId ? [projectId] : null,
  })
}
