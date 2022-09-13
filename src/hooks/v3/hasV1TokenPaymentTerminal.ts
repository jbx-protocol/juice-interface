import { V3UserContext } from 'contexts/v3/userContext'
import { useContext } from 'react'

import { useHasPaymentTerminal } from './hasPaymentTerminal'

export function useHasV1TokenPaymentTerminal(): boolean {
  const { contracts } = useContext(V3UserContext)

  return useHasPaymentTerminal(contracts?.JBV1TokenPaymentTerminal.address)
}
