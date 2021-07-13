import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { useBurnerProvider } from 'hooks/BurnerProvider'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useCallback, useEffect, useState } from 'react'
import { web3Modal } from 'utils/web3Modal'

export default function Network({ children }: { children: ChildElems }) {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()

  const loadWeb3Modal = useCallback(async () => {
    const library = await web3Modal.connect()
    const provider = new Web3Provider(library)
    setInjectedProvider(provider)
  }, [setInjectedProvider])

  const burnerProvider = useBurnerProvider()

  const signingProvider = injectedProvider ?? burnerProvider

  useEffect(() => {
    async function getNetwork() {
      await signingProvider?.ready

      const network = signingProvider?.network?.chainId
        ? NETWORKS[signingProvider.network.chainId]
        : undefined

      setNetwork(network?.name)
    }
    getNetwork()
  }, [signingProvider, setNetwork])

  useEffect(() => {
    if (web3Modal.cachedProvider) loadWeb3Modal()
  }, [loadWeb3Modal, web3Modal.cachedProvider])

  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider,
        usingBurnerProvider: !!burnerProvider,
        onNeedProvider: signingProvider ? undefined : loadWeb3Modal,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
