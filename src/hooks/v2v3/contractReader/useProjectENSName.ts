import { useCallback, useMemo } from 'react'

import { BigNumber } from 'ethers'

import { useJBProjectHandles } from 'hooks/JBProjectHandles/contracts/useJBProjectHandles'
import useV2ContractReader from './useV2ContractReader'

export default function useProjectENSName({
  projectId,
}: {
  projectId?: number
}) {
  const JBProjectHandles = useJBProjectHandles()

  return useV2ContractReader<string>({
    contract: JBProjectHandles,
    functionName: 'ensNamePartsOf',
    args: projectId ? [projectId] : null,
    formatter: useCallback(
      // JBProjectHandles stores ENS name parts in reverse order, so we format in reverse
      (val?: string[]) => (val ? [...val].reverse().join('.') : ''),
      [],
    ),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: JBProjectHandles,
                eventName: 'SetEnsNameParts',
                topics: [BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId, JBProjectHandles],
    ),
  })
}
