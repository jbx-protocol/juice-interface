import { V2V3ContractName } from 'models/v2v3/contracts'
import useV2ContractReader from './V2ContractReader'

export function useProjectPrimaryTerminal({
  projectId,
}: {
  projectId: number | undefined
}) {
  return useV2ContractReader<string>({
    contract: V2V3ContractName.JBDirectory,
    functionName: 'primaryTerminalOf',
    args: projectId ? [projectId] : null,
  })
}
