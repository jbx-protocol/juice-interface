import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useIsConnected() {
  const [{ wallet }] = useConnectWallet()
  const isConnected = useMemo(() => !!wallet, [wallet])
  return isConnected
}
