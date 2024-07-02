import { useConnectWallet } from '@web3-onboard/react'
import { BrowserProvider, ethers } from 'ethers'
import { useEffect, useMemo, useState } from 'react'
import { useChainUnsupported } from './useChainUnsupported'

export function useSigner() {
  const [{ wallet }] = useConnectWallet()
  const chainUnsupported = useChainUnsupported()
  const signerProvider = useMemo(() => {
    if (!wallet) return undefined
    return new BrowserProvider(wallet.provider, 'any')
  }, [wallet])

  const [signer, setSigner] = useState<ethers.JsonRpcSigner | undefined>(
    undefined,
  )

  useEffect(() => {
    // If the provider is not available or the chain is unsupported, we
    // shouldn't attempt to do anything
    if (!signerProvider || chainUnsupported) return undefined

    signerProvider.getSigner().then(setSigner)
  }, [chainUnsupported, signerProvider])

  return signer
}
