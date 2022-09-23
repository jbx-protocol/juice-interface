import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectTerminals({
  projectId,
  useDeprecatedContract,
}: {
  projectId?: number
  useDeprecatedContract?: boolean
}) {
  return useV2ContractReader<string[]>({
    contract: useDeprecatedContract
      ? V2V3ContractName.DeprecatedJBDirectory
      : V2V3ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId] : null,
  })
}
