import { V2ContractName } from 'models/v2/contracts'

import { useCallback } from 'react'

import useV2ContractReader from './V2ContractReader'

export default function useProjectENSName({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBProjectHandles,
    functionName: 'ensNamePartsOf',
    args: projectId ? [projectId] : null,
    formatter: useCallback(
      (val: string[]) => (val ? val.reverse().join('.') : undefined),
      [],
    ),
  })
}
