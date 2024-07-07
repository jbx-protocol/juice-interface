import { useConnectWallet } from '@web3-onboard/react'

export function useUserAddress() {
  const [{ wallet }] = useConnectWallet()
  const userAddress = wallet?.accounts[0]?.address

  return userAddress
}
