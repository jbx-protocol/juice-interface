import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useUsedDistributionLimit({
  projectId,
  terminal,
  fundingCycleNumber,
}: {
  projectId: BigNumber | undefined
  terminal: string | undefined
  fundingCycleNumber: BigNumber | undefined
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2ContractName.JBPaymentTerminalStore,
    functionName: 'usedDistributionLimitOf',
    args:
      terminal && projectId && fundingCycleNumber
        ? [terminal, projectId, fundingCycleNumber]
        : null,
  })
}
