import { Web3Provider } from '@ethersproject/providers'
import { initOnboard } from 'utils/onboard'
import { API, Subscriptions, Wallet } from 'bnc-onboard/dist/src/interfaces'

import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useRouter } from 'next/router'
import { useCallback, useContext, useEffect, useState } from 'react'

import { readNetwork } from 'constants/networks'

const KEY_SELECTED_WALLET = 'selectedWallet'

export const NetworkProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const router = useRouter()
  const { isDarkMode } = useContext(ThemeContext)

  const [signingProvider, setSigningProvider] = useState<Web3Provider>()
  const [userAddress, setUserAddress] = useState<string>()
  const [onboard, setOnboard] = useState<API>()

  const resetWallet = useCallback(() => {
    onboard?.walletReset()
    setSigningProvider(undefined)
    window && window.localStorage.setItem(KEY_SELECTED_WALLET, '')
  }, [onboard])

  const onSelectWallet = useCallback(async () => {
    resetWallet()

    // Open select wallet modal.
    const selectedWallet = await onboard?.walletSelect()

    // User quit modal.
    if (!selectedWallet) {
      return
    }

    // Wait for wallet selection initialization
    await onboard?.walletCheck()
  }, [onboard, resetWallet])

  // Initialize Onboard
  useEffect(() => {
    if (onboard) return

    const onSwitchWallet = async (newWallet: Wallet) => {
      if (newWallet.provider) {
        // Reset the account when a new wallet is connected, as it will be resolved by the provider.
        setUserAddress(undefined)
        window &&
          window.localStorage.setItem(KEY_SELECTED_WALLET, newWallet.name || '')
        setSigningProvider(new Web3Provider(newWallet.provider))
      } else {
        resetWallet()
      }
    }

    const onSwitchNetwork = (chainId: number) => {
      if (chainId) {
        setSigningProvider(p =>
          p ? new Web3Provider(p.provider, chainId) : undefined,
        )
      } else {
        setSigningProvider(undefined)
      }
    }

    const config: Subscriptions = {
      address: setUserAddress,
      wallet: onSwitchWallet,
      network: onSwitchNetwork,
    }

    setOnboard(initOnboard(config, isDarkMode))
  }, [isDarkMode, onboard, resetWallet, router])

  // Reconnect Wallet
  useEffect(() => {
    const previouslySelectedWallet =
      window && window.localStorage.getItem(KEY_SELECTED_WALLET)
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  const usingCorrectNetwork =
    signingProvider?.network?.chainId === readNetwork.chainId

  const walletIsReady = useCallback(async () => {
    if (!userAddress || !onboard) {
      await onSelectWallet()
      return false
    }
    return await onboard.walletCheck()
  }, [userAddress, onboard, onSelectWallet])

  return (
    <NetworkContext.Provider
      value={{
        shouldSwitchNetwork: signingProvider && !usingCorrectNetwork,
        signingProvider: usingCorrectNetwork ? signingProvider : undefined,
        userAddress,
        walletIsReady,
        onSelectWallet,
        onLogOut: resetWallet,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
