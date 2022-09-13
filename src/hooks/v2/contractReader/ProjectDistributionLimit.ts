import { BigNumber } from '@ethersproject/bignumber'

import { V2ContractName } from 'models/v2/contracts'

import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'

import useV2ContractReader from './V2ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  configuration,
  terminal,
  useDeprecatedContract,
}: {
  projectId: number | undefined
  configuration: string | undefined
  terminal: string | undefined
  useDeprecatedContract?: boolean
}) {
  return useV2ContractReader<BigNumber[]>({
    contract: useDeprecatedContract
      ? V2ContractName.DeprecatedJBController
      : V2ContractName.JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
