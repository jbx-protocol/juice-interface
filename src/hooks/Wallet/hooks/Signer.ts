import { Web3Provider } from '@ethersproject/providers'
import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'
import { useChainUnsupported } from './ChainUnsupported'

export function useSigner() {
  const [{ wallet }] = useConnectWallet()
  const chainUnsupported = useChainUnsupported()
  const signerProvider = useMemo(() => {
    if (!wallet) return undefined
    return new Web3Provider(wallet.provider, 'any')
  }, [wallet])

  const signer = useMemo(() => {
    // If the provider is not available or the chain is unsupported, we
    // shouldn't attempt to do anything
    if (!signerProvider || chainUnsupported) return undefined
    return signerProvider.getSigner()
  }, [chainUnsupported, signerProvider])

  return signer
}
