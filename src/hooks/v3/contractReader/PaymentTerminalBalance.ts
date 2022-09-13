import { BigNumber } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader from './V3ContractReader'

export function usePaymentTerminalBalance({
  projectId,
  terminal,
}: {
  terminal: string | undefined
  projectId: number | undefined
}) {
  return useV3ContractReader<BigNumber>({
    contract: V3ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'balanceOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
