import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useTerminalCurrentOverflow({
  terminal,
  projectId,
}: {
  terminal?: string
  projectId?: BigNumber
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: terminal && projectId ? [terminal, projectId.toHexString()] : null,
  })
}
