import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectToken({
  projectId,
}: {
  projectId?: BigNumber
}) {
  return useV2ContractReader<string>({
    contract: V2ContractName.JBTokenStore,
    functionName: 'tokenOf',
    args: projectId ? [projectId.toHexString()] : null,
  })
}
