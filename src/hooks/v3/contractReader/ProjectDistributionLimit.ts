import { BigNumber } from '@ethersproject/bignumber'

import { V3ContractName } from 'models/v3/contracts'

import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'

import useV3ContractReader from './V3ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  configuration,
  terminal,
}: {
  projectId: number | undefined
  configuration: string | undefined
  terminal: string | undefined
}) {
  return useV3ContractReader<BigNumber[]>({
    contract: V3ContractName.JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
