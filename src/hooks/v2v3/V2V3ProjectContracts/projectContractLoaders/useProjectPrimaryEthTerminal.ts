import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import {
  PaymentTerminalVersion,
  SUPPORTED_PAYMENT_TERMINALS,
  V2V3ContractName,
  V2V3Contracts,
} from 'models/v2v3/contracts'
import { useContext } from 'react'
import { isEqualAddress } from 'utils/address'
import { useProjectPrimaryEthTerminalAddress } from '../../contractReader/useProjectPrimaryEthTerminalAddress'
import { useLoadV2V3Contract } from '../../useLoadV2V3Contract'

/**
 * Load and return the primary ETH payment terminal contract for a project.
 *
 * @dev not every project uses the same payment terminal contract.
 */
export function useProjectPrimaryEthTerminal({
  projectId,
}: {
  projectId: number | undefined
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
