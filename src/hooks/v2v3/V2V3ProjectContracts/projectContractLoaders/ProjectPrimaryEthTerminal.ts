import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/ProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export function useProjectPrimaryEthTerminal({
  projectId,
}: {
  projectId: number
}) {
  const { cv, contracts } = useContext(V2V3ContractsContext)

  const { data: primaryETHTerminal, loading: JBETHPaymentTerminalLoading } =
    useProjectPrimaryEthTerminalAddress({
      projectId,
    })

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName: isEqualAddress(
      primaryETHTerminal,
      contracts?.JBETHPaymentTerminal?.address,
    )
      ? V2V3ContractName.JBETHPaymentTerminal
      : isEqualAddress(
          primaryETHTerminal,
          contracts?.JBETHPaymentTerminal3_1?.address,
        )
      ? V2V3ContractName.JBETHPaymentTerminal3_1
      : undefined,
  })

  return { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading }
}
