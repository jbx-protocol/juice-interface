import { BigNumber } from 'ethers'
import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'

import useV2ContractReader from './useV2ContractReader'

export default function useUsedDistributionLimit({
  projectId,
  terminal,
  fundingCycleNumber,
}: {
  projectId: number | undefined
  terminal: string | undefined
  fundingCycleNumber: BigNumber | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<BigNumber>({
    contract: contracts.JBETHPaymentTerminalStore,
    functionName: 'usedDistributionLimitOf',
    args:
      terminal && projectId && fundingCycleNumber
        ? [terminal, projectId, fundingCycleNumber]
        : null,
  })
}
