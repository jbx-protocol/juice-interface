import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useContext } from 'react'

import { useHasPaymentTerminal } from './hasPaymentTerminal'

export function useHasV1TokenPaymentTerminal(): boolean {
  const { contracts } = useContext(V2ContractsContext)

  return useHasPaymentTerminal(contracts?.JBV1TokenPaymentTerminal.address)
}
