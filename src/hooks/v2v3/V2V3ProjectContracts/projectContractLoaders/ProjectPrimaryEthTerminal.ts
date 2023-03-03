import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/ProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../LoadV2V3Contract'

export type JBETHPaymentTerminalVersion = '3' | '3.1'
export const ETH_PAYMENT_TERMINAL_V_3: JBETHPaymentTerminalVersion = '3'
export const ETH_PAYMENT_TERMINAL_V_3_1: JBETHPaymentTerminalVersion = '3.1'

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

  const version = isEqualAddress(
    primaryETHTerminal,
    contracts?.JBETHPaymentTerminal?.address,
  )
    ? ETH_PAYMENT_TERMINAL_V_3
    : isEqualAddress(
        primaryETHTerminal,
        contracts?.JBETHPaymentTerminal3_1?.address,
      )
    ? ETH_PAYMENT_TERMINAL_V_3_1
    : undefined

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName:
      version === ETH_PAYMENT_TERMINAL_V_3
        ? V2V3ContractName.JBETHPaymentTerminal
        : version === ETH_PAYMENT_TERMINAL_V_3_1
        ? V2V3ContractName.JBETHPaymentTerminal3_1
        : undefined,
  })

  return { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading, version }
}
