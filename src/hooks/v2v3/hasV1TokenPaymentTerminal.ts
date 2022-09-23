import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
import { useContext } from 'react'

import { useHasPaymentTerminal } from './hasPaymentTerminal'

export function useHasV1TokenPaymentTerminal(): boolean {
  const { contracts } = useContext(V2V3ContractsContext)

  return useHasPaymentTerminal(contracts?.JBV1TokenPaymentTerminal.address)
}
