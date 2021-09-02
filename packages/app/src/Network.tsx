import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'
import { readNetwork } from 'constants/networks'
import { initOnboard } from 'utils/onboard'
import { API, Subscriptions, Wallet } from 'bnc-onboard/dist/src/interfaces'
import { ThemeContext } from 'contexts/themeContext'
import { usePrevious } from 'hooks/UsePrevious'

const KEY_SELECTED_WALLET = "selectedWallet";

export default function Network({ children }: { children: ChildElems }) {
  const { isDarkMode } = useContext(ThemeContext);

  const [signingProvider, setSigningProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()
  const [account, setAccount] = useState<string>()
  const [onboard, setOnboard] = useState<API>()
  const previousAccount = usePrevious(account);

  const resetWallet = () => {
    onboard?.walletReset()
    setSigningProvider(undefined);
    window.localStorage.setItem(KEY_SELECTED_WALLET, "")
  }

  const selectWallet = async () => {
    resetWallet();

    // Open select wallet modal.
    const selectedWallet = await onboard?.walletSelect()

    // User quit modal.
    if (!selectedWallet) {
      return
    }

    // Wait for wallet selection initialization
    const readyToTransact = await onboard?.walletCheck()
    if (readyToTransact) {

      // Fetch active wallet and connect
      const currentState = onboard?.getState()
      const activeWallet = currentState?.wallet
      activeWallet?.connect && await activeWallet.connect();
    }
  }

  const logOut = async () => {
    resetWallet();
  }

  const initializeWallet = () => {
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
    setOnboard(initOnboard(config, isDarkMode))
  }

  const onDarkModeChanged = () => {
    if (onboard) {
      onboard.config({ darkMode: isDarkMode })
    }
  }

  const refreshNetwork = () => {
    async function getNetwork() {
      await signingProvider?.ready

      const network = signingProvider?.network?.chainId
        ? NETWORKS[signingProvider.network.chainId]
        : undefined

      setNetwork(network?.name)
    }
    getNetwork()
  }

  const reconnectWallet = () => {
    const previouslySelectedWallet =
      window.localStorage.getItem(KEY_SELECTED_WALLET);
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }

  const accountChanged = () => {
    // If the accounts have deterministically changed, reload the page.
    // TODO: Address this with a more elegant solution.
    if (previousAccount && account) {
      window.location.reload();
    }
  }

  useEffect(initializeWallet, [])
  useEffect(onDarkModeChanged, [isDarkMode])
  useEffect(refreshNetwork, [signingProvider, setNetwork])
  useEffect(reconnectWallet, [onboard])
  useEffect(accountChanged, [account]);

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
