import { BigNumber, BigNumberish, BytesLike, utils } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { useCallback } from 'react'

import useContractReader from './useContractReader'

/** Returns handle of project with `projectId`. */
export default function useHandleForProjectId(
  projectId: BigNumberish | undefined,
) {
  return useContractReader<string>({
    contract: V1ContractName.Projects,
    functionName: 'handleOf',
    args: projectId ? [BigNumber.from(projectId).toHexString()] : null,
    formatter: useCallback((val: BytesLike) => {
      if (val === undefined || val === null) {
        return undefined
      }
      return utils.parseBytes32String(val)
    }, []),
  })
}
