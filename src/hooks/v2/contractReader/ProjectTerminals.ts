import { V2ContractName } from 'models/v2/contracts'

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
      ? V2ContractName.DeprecatedJBDirectory
      : V2ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId] : null,
  })
}
