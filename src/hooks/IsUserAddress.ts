import { useWallet } from './Wallet'

export function useIsUserAddress(address: string | undefined) {
  const { userAddress } = useWallet()

  return (
    address !== undefined &&
    userAddress !== undefined &&
    address.toLowerCase() === userAddress.toLowerCase()
  )
}
