import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { parseBytes32String } from '@ethersproject/strings'
import { V1ContractName } from 'models/v1/contracts'
import { useCallback } from 'react'

import useContractReader from './ContractReader'

/** Returns handle of project with `projectId`. */
export default function useHandleForProjectId(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    formatter: useCallback(val => {
      if (val === undefined || val === null) {
        return undefined
      }
      return parseBytes32String(val)
    }, []),
  })
}
