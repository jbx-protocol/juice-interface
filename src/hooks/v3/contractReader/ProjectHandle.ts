import { BigNumber } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'
import { useMemo } from 'react'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'

import useV3ContractReader from './V3ContractReader'

export default function useProjectHandle({
  projectId,
}: {
  projectId?: number
}) {
  return useV3ContractReader<string>({
    contract: V3ContractName.JBProjectHandles,
    functionName: 'handleOf',
    args: projectId ? [projectId] : null,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: V3ContractName.JBProjectHandles,
                eventName: 'SetEnsNameParts',
                topics: [BigNumber.from(projectId).toHexString()],
              },
              {
                contract: V3ContractName.PublicResolver,
                eventName: 'TextChanged',
                topics: [[], projectHandleENSTextRecordKey],
              },
            ]
          : undefined,
      [projectId],
    ),
  })
}
