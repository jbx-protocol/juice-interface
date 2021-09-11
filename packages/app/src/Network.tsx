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
 
const KEY_SELECTED_WALLET = 'selectedWallet'

export default function Network({ children }: { children: ChildElems }) {
  const { isDarkMode } = useContext(ThemeContext)

  const [signingProvider, setSigningProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()
  const [account, setAccount] = useState<string>()
  const [onboard, setOnboard] = useState<API>()

  const resetWallet = () => {
    onboard?.walletReset()
    setSigningProvider(undefined)
    window.localStorage.setItem(KEY_SELECTED_WALLET, '')
  }

  const selectWallet = async () => {
    resetWallet()

    // Open select wallet modal.
    const selectedWallet = await onboard?.walletSelect()

    // User quit modal.
    if (!selectedWallet) {
      return
    }

    // Wait for wallet selection initialization
    await onboard?.walletCheck()
  }

  const logOut = async () => {
    resetWallet()
  }

  const initializeWallet = () => {
    if (onboard) return

    const selectWallet = async (newWallet: Wallet) => {
      if (newWallet.provider) {
        // Reset the account when a new wallet is connected, as it will be resolved by the provider.
        setAccount(undefined)
        window.localStorage.setItem(KEY_SELECTED_WALLET, newWallet.name || '')
        setSigningProvider(new Web3Provider(newWallet.provider))
      } else {
        resetWallet()
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
      window.localStorage.getItem(KEY_SELECTED_WALLET)
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }

  useEffect(initializeWallet, [])
  useEffect(onDarkModeChanged, [isDarkMode])
  useEffect(refreshNetwork, [signingProvider, network])
  useEffect(reconnectWallet, [onboard])

  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider:
          signingProvider && network === readNetwork.name && account
            ? signingProvider
            : undefined,
        userAddress: account,
        onSelectWallet: selectWallet,
        onLogOut: logOut,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
