import { getAddress } from '@ethersproject/address'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext } from 'react'

export function useHasPaymentTerminal(terminalAddress?: string): boolean {
  const { terminals } = useContext(V2V3ProjectContext)

  if (!terminalAddress) return false
  return terminals?.includes(getAddress(terminalAddress)) ?? false
}
