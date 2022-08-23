import { Web3Provider } from '@ethersproject/providers'
import { useConnectWallet } from '@web3-onboard/react'
import { useMemo } from 'react'

export function useProvider() {
  const [{ wallet }] = useConnectWallet()
  const provider = useMemo(
    () =>
      wallet?.provider ? new Web3Provider(wallet.provider, 'any') : undefined,
    [wallet],
  )
  return provider
}
