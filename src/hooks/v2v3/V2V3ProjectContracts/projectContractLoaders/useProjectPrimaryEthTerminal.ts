import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName, V2V3Contracts } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/useProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

/**
 * Single source of truth for supported terminal versions.
 *
 * DEV NOTE:
 * To support a new payment terminal:
 * 1. Add it to V2V3ContractName
 * 2. Add it to this array
 * 3. Add support for it in any other transactions that use it.
 */
export const SUPPORTED_PAYMENT_TERMINALS = [
  V2V3ContractName.JBETHPaymentTerminal,
  V2V3ContractName.JBETHPaymentTerminal3_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_1,
  V2V3ContractName.JBETHPaymentTerminal3_1_2,
] as const

export type PaymentTerminalVersion =
  (typeof SUPPORTED_PAYMENT_TERMINALS)[number]

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

  const terminalName = getTerminalName(primaryETHTerminal, contracts)

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName: terminalName,
  })

  return {
    JBETHPaymentTerminal,
    loading: JBETHPaymentTerminalLoading,
    version: terminalName,
  }
}

const getTerminalName = (
  address: string | undefined,
  contracts: V2V3Contracts | undefined,
): PaymentTerminalVersion | undefined => {
  if (!address || !contracts) return undefined

  const terminalName = SUPPORTED_PAYMENT_TERMINALS.find(contractName => {
    return isEqualAddress(
      address,
      contracts[contractName as V2V3ContractName]?.address,
    )
  })

  return terminalName
}
