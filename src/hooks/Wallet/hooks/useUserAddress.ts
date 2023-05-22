import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useUserAddress() {
  const [{ wallet }] = useConnectWallet()
  const userAddress = useMemo(() => wallet?.accounts[0]?.address, [wallet])

  return userAddress
}
