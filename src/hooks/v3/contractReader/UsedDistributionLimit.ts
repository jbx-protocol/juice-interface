import { BigNumber } from '@ethersproject/bignumber'
import { V3ContractName } from 'models/v3/contracts'

import useV3ContractReader from './V3ContractReader'

export default function useUsedDistributionLimit({
  projectId,
  terminal,
  fundingCycleNumber,
}: {
  projectId: number | undefined
  terminal: string | undefined
  fundingCycleNumber: BigNumber | undefined
}) {
  return useV3ContractReader<BigNumber>({
    contract: V3ContractName.JBSingleTokenPaymentTerminalStore,
    functionName: 'usedDistributionLimitOf',
    args:
      terminal && projectId && fundingCycleNumber
        ? [terminal, projectId, fundingCycleNumber]
        : null,
  })
}
