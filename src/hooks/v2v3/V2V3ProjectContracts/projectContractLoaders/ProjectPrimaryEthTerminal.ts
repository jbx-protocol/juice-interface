import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/ProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export function useProjectPrimaryEthTerminal({
  projectId,
}: {
  projectId: number
}) {
  const { cv } = useContext(V2V3ContractsContext)

  const { data: primaryETHTerminal, loading: JBETHPaymentTerminalLoading } =
    useProjectPrimaryEthTerminalAddress({
      projectId,
    })

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName: V2V3ContractName.JBETHPaymentTerminal,
  })

  return { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading }
}
