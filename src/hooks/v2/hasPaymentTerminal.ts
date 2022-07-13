import { V2ProjectContext } from 'contexts/v2/projectContext'
import { getAddress } from '@ethersproject/address'
import { useContext } from 'react'

export function useHasPaymentTerminal(terminalAddress?: string): boolean {
  const { terminals } = useContext(V2ProjectContext)

  if (!terminalAddress) return false
  return terminals?.includes(getAddress(terminalAddress)) ?? false
}
