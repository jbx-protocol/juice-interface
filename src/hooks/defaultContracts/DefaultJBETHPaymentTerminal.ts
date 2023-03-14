import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { useContext } from 'react'

export function useDefaultJBETHPaymentTerminal() {
  const { contracts } = useContext(V2V3ContractsContext)

  return contracts?.JBETHPaymentTerminal
}
