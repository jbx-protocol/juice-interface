import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader, { ContractReadResult } from './V2ContractReader'

export function useV1ProjectIdOfV2Project(
  projectId: BigNumberish | undefined,
): ContractReadResult<BigNumber | undefined> {
  return useV2ContractReader<BigNumber>({
    contract: V2V3ContractName.JBV1TokenPaymentTerminal,
    functionName: 'v1ProjectIdOf',
    args: projectId ? [projectId] : null,
  })
}
