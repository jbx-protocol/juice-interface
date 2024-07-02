import { V1ContractName } from 'models/v1/contracts'
import { useCallback } from 'react'
import { BigintIsh, toHexString } from 'utils/bigNumbers'

import { BytesLike, ethers } from 'ethers'
import useContractReader from './useContractReader'

/** Returns handle of project with `projectId`. */
export default function useHandleForProjectId(
  projectId: BigintIsh | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [toHexString(BigInt(projectId))] : null,
    formatter: useCallback((val: BytesLike) => {
      if (val === undefined || val === null) {
        return undefined
      }
      return ethers.decodeBytes32String(val)
    }, []),
  })
}
