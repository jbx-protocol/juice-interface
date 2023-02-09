import { ContractConfig } from 'hooks/ContractReader/types'
import { V2V3ContractName } from 'models/v2v3/contracts'
import useV2ContractReader from './V2ContractReader'

export default function useProjectControllerAddress({
  projectId,
  contract,
  useDeprecatedContract,
}: {
  projectId?: number
  contract?: ContractConfig<V2V3ContractName> | undefined
  useDeprecatedContract?: boolean
}) {
  if (!contract) {
    contract = useDeprecatedContract
      ? V2V3ContractName.DeprecatedJBDirectory
      : V2V3ContractName.JBDirectory
  }
  return useV2ContractReader<string>({
    contract,
    functionName: 'controllerOf',
    args: projectId ? [projectId] : null,
  })
}
