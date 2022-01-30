import { BigNumber, utils } from 'ethers'
import { V1ContractName } from 'models/v1/contracts'
import { normalizeHandle } from 'utils/formatHandle'

import useContractReader from './ContractReader'

/** Returns ID of project with `handle`. */
export default function useProjectIdForHandle(handle: string | undefined) {
  return useContractReader<BigNumber>({
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [utils.formatBytes32String(normalizeHandle(handle))] : null,
  })
}
