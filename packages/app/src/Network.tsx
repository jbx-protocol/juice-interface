import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'
import { readNetwork } from 'constants/networks'

// TODO(odd-amphora): organize.
import { initOnboard } from 'services'
import { API, Subscriptions, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'

const KEY_SELECTED_WALLET = "selectedWallet";

export default function Network({ children }: { children: ChildElems }) {
  const { themeOption } = useContext(ThemeContext);

  const [signingProvider, setSigningProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()
  const [account, setAccount] = useState<string>()
  const [onboard, setOnboard] = useState<API>()

  const isDarkMode = () => {
    return themeOption == ThemeOption.dark;
  }

  const resetWallet = () => {
    onboard?.walletReset()
    setSigningProvider(undefined);
    window.localStorage.setItem(KEY_SELECTED_WALLET, "")
  }

  const selectWallet = async () => {
    resetWallet();

    console.log('selectWallet():enter');
    // Open select wallet modal.
    const selectedWallet = await onboard?.walletSelect()
    console.log('selectWallet():modal done');

    // User quit modal.
    if (!selectedWallet) {
      console.log('selectWallet():user quit modal');
      return
    }

    console.log('selectedWallet: ', selectedWallet);

    // Wait for wallet selection initialization
    const readyToTransact = await onboard?.walletCheck()
    if (readyToTransact) {
      console.log('selectWallet():ready to transact');

      // Fetch active wallet and connect
      const currentState = onboard?.getState()
      const activeWallet = currentState?.wallet
      activeWallet?.connect && await activeWallet.connect();
    }
  }

  const logOut = async () => {
    resetWallet();
  }

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
    const previouslySelectedWallet =
      window.localStorage.getItem(KEY_SELECTED_WALLET);
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  // Propagate theme changes.
  useEffect(() => {
    if (onboard) {
      onboard.config({ darkMode: themeOption === ThemeOption.dark })
    }
  }, [themeOption]);

  // Initialize wallet.
  useEffect(() => {
    if (onboard) return;

    const selectWallet = async (newWallet: Wallet) => {
      if (newWallet.provider) {
        setSigningProvider(new Web3Provider(newWallet.provider))
        window.localStorage.setItem(KEY_SELECTED_WALLET, newWallet.name || "")
      } else {
        resetWallet();
      }
    }
    const config: Subscriptions = {
      address: setAccount,
      wallet: selectWallet,
    }
    setOnboard(initOnboard(config, isDarkMode()))
  }, [])

  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider: signingProvider && network === readNetwork.name ? signingProvider : undefined,
        userAddress: account,
        onNeedProvider: signingProvider ? undefined : selectWallet,
        onSelectWallet: selectWallet,
        onLogOut: logOut,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
