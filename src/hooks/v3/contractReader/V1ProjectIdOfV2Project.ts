import { BigNumber, BigNumberish } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader, { ContractReadResult } from './V3ContractReader'

export function useV1ProjectIdOfV2Project(
  projectId: BigNumberish | undefined,
): ContractReadResult<BigNumber | undefined> {
  return useV3ContractReader<BigNumber>({
    contract: V3ContractName.JBV1TokenPaymentTerminal,
    functionName: 'v1ProjectIdOf',
    args: projectId ? [projectId] : null,
  })
}
