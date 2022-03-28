import { BigNumber } from '@ethersproject/bignumber'
import { V2ContractName } from 'models/v2/contracts'

import useV2ContractReader from './V2ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  domain,
  terminal,
}: {
  projectId: BigNumber | undefined
  domain: string | undefined
  terminal: string | undefined
}) {
  return useV2ContractReader<BigNumber[]>({
    contract: V2ContractName.JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && domain && terminal
        ? [projectId.toHexString(), domain, terminal]
        : null,
  })
}
