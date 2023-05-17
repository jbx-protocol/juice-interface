import { useAccount } from 'wagmi'

export function useUserAddress() {
  const { address } = useAccount()

  return address
}
