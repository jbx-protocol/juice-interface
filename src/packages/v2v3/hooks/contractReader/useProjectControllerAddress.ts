import { ContractConfig } from 'hooks/ContractReader/types'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
import useV2ContractReader from './useV2ContractReader'

export default function useProjectControllerAddress({
  projectId,
  contract,
}: {
  projectId?: number
  contract?: ContractConfig<V2V3ContractName> | undefined
}) {
  return useV2ContractReader<string>({
    contract: contract ?? V2V3ContractName.JBDirectory,
    functionName: 'controllerOf',
    args: projectId ? [projectId] : null,
  })
}
