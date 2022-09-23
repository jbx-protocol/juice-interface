import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export function usePaymentTerminalBalance({
  projectId,
  terminal,
}: {
  terminal: string | undefined
  projectId: number | undefined
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2V3ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'balanceOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
