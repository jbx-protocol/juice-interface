import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import { JB_CONTROLLER_V_3_1 } from '../V2V3ProjectContracts/projectContractLoaders/useProjectController'
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
    versions: { JBControllerVersion },
  } = useContext(V2V3ProjectContractsContext)

  // v3_1 introduced JBFundAccessConstraintsStore, which should be used instead of JB controller.
  const contract =
    JBControllerVersion === JB_CONTROLLER_V_3_1
      ? JBFundAccessConstraintsStore
      : JBController

  return useV2ContractReader<BigNumber[]>({
    contract,
    functionName: 'distributionLimitOf',
    args:
      projectId && configuration && terminal && contract
        ? [projectId, configuration, terminal, ETH_TOKEN_ADDRESS]
        : null,
  })
}
