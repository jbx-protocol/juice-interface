import { useAccount } from 'wagmi'

export function useIsConnected() {
  const { isConnected } = useAccount()

  return isConnected
}
