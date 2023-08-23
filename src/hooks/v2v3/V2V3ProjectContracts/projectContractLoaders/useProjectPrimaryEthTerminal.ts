import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { V2V3ContractName, V2V3Contracts } from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/useProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

export type JBETHPaymentTerminalVersion = '3' | '3.1' | '3.1.1' | '3.1.2'
export const JB_ETH_PAYMENT_TERMINAL_V_3: JBETHPaymentTerminalVersion = '3'
export const JB_ETH_PAYMENT_TERMINAL_V_3_1: JBETHPaymentTerminalVersion = '3.1'
export const JB_ETH_PAYMENT_TERMINAL_V_3_1_1: JBETHPaymentTerminalVersion =
  '3.1.1'
export const JB_ETH_PAYMENT_TERMINAL_V_3_1_2: JBETHPaymentTerminalVersion =
  '3.1.2'

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

  const version = getTerminalVersion(primaryETHTerminal, contracts)

  const JBETHPaymentTerminal = useLoadV2V3Contract({
    cv,
    address: primaryETHTerminal,
    contractName: getContractName(version),
  })

  return { JBETHPaymentTerminal, loading: JBETHPaymentTerminalLoading, version }
}

const getContractName = (version: JBETHPaymentTerminalVersion | undefined) => {
  if (!version) return undefined
  switch (version) {
    case JB_ETH_PAYMENT_TERMINAL_V_3:
      return V2V3ContractName.JBETHPaymentTerminal
    case JB_ETH_PAYMENT_TERMINAL_V_3_1:
      return V2V3ContractName.JBETHPaymentTerminal3_1
    case JB_ETH_PAYMENT_TERMINAL_V_3_1_1:
      return V2V3ContractName.JBETHPaymentTerminal3_1_1
    case JB_ETH_PAYMENT_TERMINAL_V_3_1_2:
      return V2V3ContractName.JBETHPaymentTerminal3_1_2
  }
}

const getTerminalVersion = (
  address: string | undefined,
  contracts: V2V3Contracts | undefined,
) => {
  if (!address || !contracts) return undefined

  if (isEqualAddress(address, contracts.JBETHPaymentTerminal?.address)) {
    return JB_ETH_PAYMENT_TERMINAL_V_3
  }
  if (isEqualAddress(address, contracts.JBETHPaymentTerminal3_1?.address)) {
    return JB_ETH_PAYMENT_TERMINAL_V_3_1
  }
  if (isEqualAddress(address, contracts.JBETHPaymentTerminal3_1_1?.address)) {
    return JB_ETH_PAYMENT_TERMINAL_V_3_1_1
  }
  if (isEqualAddress(address, contracts.JBETHPaymentTerminal3_1_2?.address)) {
    return JB_ETH_PAYMENT_TERMINAL_V_3_1_2
  }
}
