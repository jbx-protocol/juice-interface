import { useConnectWallet } from '@web3-onboard/react'

export function useIsConnected() {
  const [{ wallet }] = useConnectWallet()
  return !!wallet
}
