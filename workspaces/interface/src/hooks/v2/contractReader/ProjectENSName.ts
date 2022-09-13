import { V2ContractName } from 'models/v2/contracts'

import { useCallback, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

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
      // JBProjectHandles stores ENS name parts in reverse order, so we format in reverse
      (val?: string[]) => (val ? [...val].reverse().join('.') : ''),
      [],
    ),
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: V2ContractName.JBProjectHandles,
                eventName: 'SetEnsNameParts',
                topics: [BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })
}
