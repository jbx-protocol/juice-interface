import type { MetaMaskInpageProvider } from '@metamask/providers'
import { providers } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { useMemo } from 'react'

declare global {
  interface Window {
    ethereum?: providers.ExternalProvider
  }
}

export const useProviderIsMetamask = () => {
  const { signer } = useWallet()
  const isMetamask = useMemo(() => {
    return signer?.provider.connection.url === 'metamask'
  }, [signer])
  return isMetamask
}

export const useMetamask = () => {
  const ethereum = global?.window?.ethereum
  if (!ethereum || !ethereum.isMetaMask) return
  return ethereum as unknown as MetaMaskInpageProvider
}
