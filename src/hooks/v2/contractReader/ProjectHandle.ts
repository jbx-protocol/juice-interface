import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'
import { useMemo } from 'react'

import { projectHandleENSTextRecordKey } from 'constants/projectHandleENSTextRecordKey'

import useV2ContractReader from './V2ContractReader'

export default function useProjectHandle({
  projectId,
}: {
  projectId?: number
}) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBProjectHandles,
    functionName: 'handleOf',
    args: projectId ? [projectId] : null,
    updateOn: useMemo(
      () =>
        projectId
          ? [
              {
                contract: V2ContractName.JBProjectHandles,
                eventName: 'SetEnsNameParts',
                topics: [BigNumber.from(projectId).toHexString()],
              },
              {
                contract: V2ContractName.PublicResolver,
                eventName: 'TextChanged',
                topics: [[], projectHandleENSTextRecordKey],
              },
            ]
          : undefined,
      [projectId],
    ),
  })
}
