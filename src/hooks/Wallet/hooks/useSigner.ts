import { useSigner as useWagmiSigner } from 'wagmi'

export function useSigner() {
  return useWagmiSigner()
}
