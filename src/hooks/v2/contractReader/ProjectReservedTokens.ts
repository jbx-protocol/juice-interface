import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useContractReader from './V2ContractReader'

export default function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: BigNumber | undefined
  reservedRate: BigNumber | undefined
}) {
  return useContractReader<BigNumber>({
    contract: V2ContractName.JBController,
    functionName: 'reservedTokenBalanceOf',
    args:
      projectId && reservedRate
        ? [BigNumber.from(projectId).toHexString(), reservedRate]
        : null,
  })
}
