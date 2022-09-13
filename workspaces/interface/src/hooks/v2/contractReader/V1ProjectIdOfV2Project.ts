import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader, { ContractReadResult } from './V2ContractReader'

export function useV1ProjectIdOfV2Project(
  projectId: BigNumberish | undefined,
): ContractReadResult<BigNumber | undefined> {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBV1TokenPaymentTerminal,
    functionName: 'v1ProjectIdOf',
    args: projectId ? [projectId] : null,
  })
}
