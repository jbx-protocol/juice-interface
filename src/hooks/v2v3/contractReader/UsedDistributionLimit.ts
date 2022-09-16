import { BigNumber } from '@ethersproject/bignumber'
import { V2V3ContractName } from 'models/v2v3/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useUsedDistributionLimit({
  projectId,
  terminal,
  fundingCycleNumber,
}: {
  projectId: number | undefined
  terminal: string | undefined
  fundingCycleNumber: BigNumber | undefined
}) {
  return useV2ContractReader<BigNumber>({
    contract: V2V3ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'usedDistributionLimitOf',
    args:
      terminal && projectId && fundingCycleNumber
        ? [terminal, projectId, fundingCycleNumber]
        : null,
  })
}
