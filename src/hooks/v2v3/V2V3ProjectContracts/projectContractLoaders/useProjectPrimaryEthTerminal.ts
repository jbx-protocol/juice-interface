import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/useProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

export type JBETHPaymentTerminalVersion = '3' | '3.1' | '3.1.1'
export const JB_ETH_PAYMENT_TERMINAL_V_3: JBETHPaymentTerminalVersion = '3'
export const JB_ETH_PAYMENT_TERMINAL_V_3_1: JBETHPaymentTerminalVersion = '3.1'
export const JB_ETH_PAYMENT_TERMINAL_V_3_1_1: JBETHPaymentTerminalVersion =
  '3.1.1'

/**
 * Load and return the primary ETH payment terminal contract for a project.
 *
 * @dev not every project uses the same payment terminal contract.
 */
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
    ? JB_ETH_PAYMENT_TERMINAL_V_3
    : isEqualAddress(
        primaryETHTerminal,
        contracts?.JBETHPaymentTerminal3_1?.address,
      )
    ? JB_ETH_PAYMENT_TERMINAL_V_3_1
    : isEqualAddress(
        primaryETHTerminal,
        contracts?.JBETHPaymentTerminal3_1_1?.address,
      )
    ? JB_ETH_PAYMENT_TERMINAL_V_3_1_1
    : undefined

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName:
      version === JB_ETH_PAYMENT_TERMINAL_V_3
        ? V2V3ContractName.JBETHPaymentTerminal
        : version === JB_ETH_PAYMENT_TERMINAL_V_3_1
        ? V2V3ContractName.JBETHPaymentTerminal3_1
        : version === JB_ETH_PAYMENT_TERMINAL_V_3_1_1
        ? V2V3ContractName.JBETHPaymentTerminal3_1_1
        : undefined,
  })

  return { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading, version }
}
