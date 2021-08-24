import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { useBurnerProvider } from 'hooks/BurnerProvider'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useCallback, useEffect, useState } from 'react'
import { web3Modal } from 'utils/web3Modal'

// TODO(odd-amphora): new stuff. organize
import { initOnboard, initNotify } from 'services'
import { API } from 'bnc-onboard/dist/src/interfaces'
import ethers from 'ethers';
import Onboard from 'bnc-onboard'
import Web3 from 'web3';

export default function Network({ children }: { children: ChildElems }) {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()

  const loadWeb3Modal = useCallback(async () => {
    const library = await web3Modal.connect()
    const provider = new Web3Provider(library)
    setInjectedProvider(provider)
  }, [setInjectedProvider])

  const selectWallet = async () => {
    // Open wallet modal
    const selectedWallet = await onboard?.walletSelect();

    // User quit modal
    if (!selectedWallet) {
      return;
    }

    // Wait for wallet selection initialization
    const readyToTransact = await onboard?.walletCheck();
    if (readyToTransact) {
      // Fetch active wallet and connect
      const currentState = onboard?.getState();
      const activeWallet = currentState?.wallet;
      activeWallet?.connect?.call(onboard);
    }
  };

  const logOut = async () => {
    onboard?.walletReset();
    setWallet(null);
  }

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


  const [address, setAddress] = useState<any>();
  const [wallet, setWallet] = useState<any>();
  const [web3, setWeb3] = useState<any>();
  const [onboard, setOnboard] = useState<API>();

  useEffect(() => {
    if (web3Modal.cachedProvider) loadWeb3Modal()
  }, [loadWeb3Modal, web3Modal.cachedProvider])

  const dispatchConnectionConnected = () => {
    // dispatch(connectionConnected(account));
  };

  useEffect(() => {
    const selectWallet = async (newWallet) => {
      if (newWallet.provider) {
        const newWeb3 = new Web3(newWallet.provider);
        newWeb3.eth.net.isListening().then(dispatchConnectionConnected);
        setWallet(newWallet);

        setWeb3(newWeb3);
        window.localStorage.setItem('selectedWallet', newWallet.name);
      } else {
        setWallet(null);
      }
    };
    const config = {
      address: setAddress,
      wallet: selectWallet,
    }
    const onboard = initOnboard(config);
    // TODO(odd-amphora) init notify
    setOnboard(onboard)
  }, [])


  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider,
        usingBurnerProvider: !!burnerProvider,
        wallet: wallet,
        onNeedProvider: signingProvider ? undefined : loadWeb3Modal,
        onSelectWallet: selectWallet,
        onLogOut: logOut,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
