import { BigNumber } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'

import useContractReader from './V3ContractReader'

export default function useProjectReservedTokens({
  projectId,
  reservedRate,
}: {
  projectId: number | undefined
  reservedRate: BigNumber | undefined
}) {
  return useContractReader<BigNumber>({
    contract: V3ContractName.JBController,
    functionName: 'reservedTokenBalanceOf',
    args: projectId && reservedRate ? [projectId, reservedRate] : null,
  })
}
