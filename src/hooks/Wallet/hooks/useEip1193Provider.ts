import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useEip1193Provider() {
  const [{ wallet }] = useConnectWallet()

  // The EIP-1193 provider is wallet.provider
  const eip1193Provider = useMemo(() => {
    if (!wallet) {
      return undefined
    }
    return wallet.provider;
  }, [wallet])

  return eip1193Provider
}
