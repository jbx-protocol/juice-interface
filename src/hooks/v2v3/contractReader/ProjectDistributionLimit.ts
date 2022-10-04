import { BigNumber } from '@ethersproject/bignumber'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/V2V3ProjectContractsContext'
import { useContext } from 'react'
import useV2ContractReader from './V2ContractReader'

export default function useProjectDistributionLimit({
  projectId,
  configuration,
  terminal,
}: {
  projectId: number | undefined
  configuration: string | undefined
  terminal: string | undefined
}) {
  const {
    contracts: { JBController },
  } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<BigNumber[]>({
    contract: JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
