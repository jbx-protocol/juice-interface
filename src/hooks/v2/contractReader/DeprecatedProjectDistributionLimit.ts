import { BigNumber } from '@ethersproject/bignumber'

import { V2ContractName } from 'models/v2/contracts'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

import useV2ContractReader from './V2ContractReader'

export default function useDeprecatedProjectDistributionLimit({
  projectId,
  configuration,
  terminal,
}: {
  projectId: number | undefined
  configuration: string | undefined
  terminal: string | undefined
}) {
  return useV2ContractReader<BigNumber[]>({
    contract: V2ContractName.DeprecatedJBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
