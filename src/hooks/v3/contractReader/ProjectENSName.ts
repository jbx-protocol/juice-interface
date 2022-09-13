import { V3ContractName } from 'models/v3/contracts'

import { useCallback, useMemo } from 'react'

import { BigNumber } from '@ethersproject/bignumber'

import useV3ContractReader from './V3ContractReader'

export default function useProjectENSName({
  projectId,
}: {
  projectId?: number
}) {
  return useV3ContractReader<string>({
    contract: V3ContractName.JBProjectHandles,
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
                contract: V3ContractName.JBProjectHandles,
                eventName: 'SetEnsNameParts',
                topics: [BigNumber.from(projectId).toHexString()],
              },
            ]
          : undefined,
      [projectId],
    ),
  })
}
