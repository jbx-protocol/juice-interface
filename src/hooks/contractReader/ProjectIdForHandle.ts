import { BigNumber, utils } from 'ethers'
import { ContractName } from 'models/contract-name'
import { normalizeHandle } from 'utils/formatHandle'

import useContractReader from './ContractReader'

/** Returns ID of project with `handle`. */
export default function useProjectIdForHandle(handle: string | undefined) {
  return useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [utils.formatBytes32String(normalizeHandle(handle))] : null,
  })
}
