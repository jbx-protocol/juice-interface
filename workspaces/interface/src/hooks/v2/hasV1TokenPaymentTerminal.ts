import { V2UserContext } from 'contexts/v2/userContext'
import { useContext } from 'react'

import { useHasPaymentTerminal } from './hasPaymentTerminal'

export function useHasV1TokenPaymentTerminal(): boolean {
  const { contracts } = useContext(V2UserContext)

  return useHasPaymentTerminal(contracts?.JBV1TokenPaymentTerminal.address)
}
