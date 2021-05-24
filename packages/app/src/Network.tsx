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
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  const burnerProvider = useBurnerProvider(NetworkName.localhost)

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

  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider,
        onNeedProvider: loadWeb3Modal,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
