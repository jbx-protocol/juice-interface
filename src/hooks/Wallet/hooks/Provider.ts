import { JsonRpcBatchProvider, Web3Provider } from '@ethersproject/providers'
import { useConnectWallet } from '@web3-onboard/react'
import { readNetwork } from 'constants/networks'
import { useMemo } from 'react'

export function useProvider() {
  const readProvider = useMemo(
    () => new JsonRpcBatchProvider(readNetwork.rpcUrl),
    [],
  )
  const [{ wallet }] = useConnectWallet()
  const provider = useMemo(() => {
    if (wallet) {
      return new Web3Provider(wallet.provider, 'any')
    }
    return readProvider
  }, [readProvider, wallet])
  return provider
}
