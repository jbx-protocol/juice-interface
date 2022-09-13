import { getAddress } from '@ethersproject/address'
import { V3ProjectContext } from 'contexts/v3/projectContext'
import { useContext } from 'react'

export function useHasPaymentTerminal(terminalAddress?: string): boolean {
  const { terminals } = useContext(V3ProjectContext)

  if (!terminalAddress) return false
  return terminals?.includes(getAddress(terminalAddress)) ?? false
}
