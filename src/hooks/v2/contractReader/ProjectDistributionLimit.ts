import { BigNumber } from '@ethersproject/bignumber'

import { V2ContractName } from 'models/v2/contracts'

import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'

import useV2ContractReader from './V2ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  configuration,
  terminal,
}: {
  projectId: BigNumber | undefined
  configuration: string | undefined
  terminal: string | undefined
}) {
  return useV2ContractReader<BigNumber[]>({
    contract: V2ContractName.JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId.toHexString(), configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
