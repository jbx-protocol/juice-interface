import { BigNumber } from '@ethersproject/bignumber'
import { formatBytes32String } from '@ethersproject/strings'

import { V1ContractName } from 'models/v1/contracts'
import { normalizeHandle } from 'utils/format/formatHandle'

import useContractReader from './ContractReader'

/** Returns ID of project with `handle`. */
export default function useProjectIdForHandle(handle: string | undefined) {
  return useContractReader<BigNumber>({
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: handle ? [formatBytes32String(normalizeHandle(handle))] : null,
  })
}
