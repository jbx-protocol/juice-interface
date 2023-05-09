import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

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
    contracts: { JBController, JBFundAccessConstraintsStore },
  } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<BigNumber[]>({
    // v3_1 introduced JBFundAccessConstraintsStore which should be used instead of JB controller.
    // If a project doesn't have a JBFundAccessConstraintsStore, use the JBController, then its version is <3_1
    contract: JBFundAccessConstraintsStore ?? JBController,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
