import { useAccount } from 'wagmi'

export function useIsUserAddress(address: string | undefined) {
  const { address: userAddress } = useAccount()

  return (
    address !== undefined &&
    userAddress !== undefined &&
    address.toLowerCase() === userAddress.toLowerCase()
  )
}
