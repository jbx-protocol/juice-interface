import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useTerminalCurrentOverflow({
  terminal,
  projectId,
}: {
  terminal?: string
  projectId?: number
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
