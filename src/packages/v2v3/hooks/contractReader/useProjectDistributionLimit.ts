import { BigNumber } from 'ethers'
import { ETH_TOKEN_ADDRESS } from 'packages/v2v3/constants/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { V2V3ContractName } from 'packages/v2v3/models/contracts'
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
    versions: { JBControllerVersion },
  } = useContext(V2V3ProjectContractsContext)

  // v3_1 introduced JBFundAccessConstraintsStore, which should be used instead of JB controller.
  const contract =
    JBControllerVersion === V2V3ContractName.JBController3_1
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
