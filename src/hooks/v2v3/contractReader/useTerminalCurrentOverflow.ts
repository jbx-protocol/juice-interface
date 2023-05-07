import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
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

  return useV2ContractReader<BigNumber>({
    contract: contracts.JBETHPaymentTerminalStore,
    functionName: 'currentOverflowOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
