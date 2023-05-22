import { useConnectWallet } from '@web3-onboard/react'
import { providers } from 'ethers'
import { useMemo } from 'react'
import { useChainUnsupported } from './useChainUnsupported'

export function useSigner() {
  const [{ wallet }] = useConnectWallet()
  const chainUnsupported = useChainUnsupported()
  const signerProvider = useMemo(() => {
    if (!wallet) return undefined
    return new providers.Web3Provider(wallet.provider, 'any')
  }, [wallet])

  const signer = useMemo(() => {
    // If the provider is not available or the chain is unsupported, we
    // shouldn't attempt to do anything
    if (!signerProvider || chainUnsupported) return undefined
    return signerProvider.getSigner()
  }, [chainUnsupported, signerProvider])

  return signer
}
