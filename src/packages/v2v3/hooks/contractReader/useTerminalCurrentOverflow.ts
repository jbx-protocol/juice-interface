import { V2V3ProjectContractsContext } from 'packages/v2v3/contexts/ProjectContracts/V2V3ProjectContractsContext'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

export default function useTerminalCurrentOverflow({
  terminal,
  projectId,
}: {
  terminal?: string
  projectId?: number
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<bigint>({
    contract: contracts.JBETHPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
