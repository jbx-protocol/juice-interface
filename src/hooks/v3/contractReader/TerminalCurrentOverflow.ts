import { BigNumber } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader from './V3ContractReader'

export default function useTerminalCurrentOverflow({
  terminal,
  projectId,
}: {
  terminal?: string
  projectId?: number
}) {
  return useV3ContractReader<BigNumber>({
    contract: V3ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
