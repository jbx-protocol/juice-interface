import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'

import useV2ContractReader from './useV2ContractReader'

export default function useUsedDistributionLimit({
  projectId,
  terminal,
  fundingCycleNumber,
}: {
  projectId: number | undefined
  terminal: string | undefined
  fundingCycleNumber: bigint | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<bigint>({
    contract: contracts.JBETHPaymentTerminalStore,
    functionName: 'usedDistributionLimitOf',
    args:
      terminal && projectId && fundingCycleNumber
        ? [terminal, projectId, fundingCycleNumber]
        : null,
  })
}
