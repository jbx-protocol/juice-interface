import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { BigNumber } from 'ethers'
import { useContext } from 'react'
import useV2ContractReader from './useV2ContractReader'

export function usePaymentTerminalBalance({
  projectId,
  terminal,
}: {
  terminal: string | undefined
  projectId: number | undefined
}) {
  const { contracts } = useContext(V2V3ProjectContractsContext)

  return useV2ContractReader<BigNumber>({
    contract: contracts.JBETHPaymentTerminalStore,
    functionName: 'balanceOf',
    args: terminal && projectId ? [terminal, projectId] : null,
  })
}
