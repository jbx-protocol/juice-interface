import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectTerminals({
  projectId,
}: {
  projectId?: BigNumber
}) {
  return useV2ContractReader<string[]>({
    contract: V2ContractName.JBDirectory,
    functionName: 'terminalsOf',
    args: projectId ? [projectId.toHexString()] : null,
  })
}
