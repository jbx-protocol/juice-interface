import { V2V3ContractsContext } from 'packages/v2v3/contexts/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

/**
 * Return the payment terminal address that should be used to launch projects, funding cycles, etc.
 */
export function useDefaultJBETHPaymentTerminal() {
  const { contracts } = useContext(V2V3ContractsContext)

  return contracts?.JBETHPaymentTerminal3_1_2
}
