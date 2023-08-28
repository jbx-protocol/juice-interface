import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { V2V3ContractName } from 'models/v2v3/contracts'
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
