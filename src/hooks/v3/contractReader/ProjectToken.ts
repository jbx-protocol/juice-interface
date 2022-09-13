import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader from './V3ContractReader'

export default function useProjectToken({ projectId }: { projectId?: number }) {
  return useV3ContractReader<string>({
    contract: V3ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId] : null,
  })
}
