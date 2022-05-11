import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export function usePaymentTerminalBalance({
  projectId,
  terminal,
}: {
  terminal: string | undefined
  projectId: number | undefined
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'balanceOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
