import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { useBurnerProvider } from 'hooks/BurnerProvider'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useCallback, useContext, useEffect, useState } from 'react'
import { web3Modal } from 'utils/web3Modal'

// TODO(odd-amphora): new stuff. organize
import { initOnboard, initNotify } from 'services'
import { API } from 'bnc-onboard/dist/src/interfaces'
import ethers from 'ethers'
import Onboard from 'bnc-onboard'
import Web3 from 'web3'
import { Account } from 'bnc-notify'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'

export default function Network({ children }: { children: ChildElems }) {
  const { themeOption } = useContext(ThemeContext);

  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()

  // TODO(odd-amphora): new.
  const [account, setAccount] = useState<Account>()
  const [wallet, setWallet] = useState<any>()
  const [web3, setWeb3] = useState<Web3>()
  const [onboard, setOnboard] = useState<API>()
  const [notify, setNotify] = useState<any>()

  const burnerProvider = useBurnerProvider()

  const signingProvider = injectedProvider ?? burnerProvider

  const isDarkMode = () => {
    return themeOption == ThemeOption.dark;
  }

  const selectWallet = async () => {
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
      activeWallet?.connect?.call(onboard)
    }
  }

  const logOut = async () => {
    onboard?.walletReset()
    setWallet(null)
    setWeb3(undefined);
  }

  const accountChanged = () => {
    // if (account) {
    //   dispatch(accountUpdated(account, web3));
    // }
    console.log('Account changed: ', account)
  }

  // TODO(odd-amphora): still neded?
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

  useEffect(accountChanged, [account])

  useEffect(() => {
    const previouslySelectedWallet =
      window.localStorage.getItem('selectedWallet')
    if (previouslySelectedWallet && onboard) {
      onboard.walletSelect(previouslySelectedWallet)
    }
  }, [onboard])

  useEffect(() => {
    if (onboard) {
      onboard.config({ darkMode: themeOption === ThemeOption.dark })
    }
  }, [themeOption]);

  const dispatchConnectionConnected = () => {
    // TODO(odd-amphora): support?
    // dispatch(connectionConnected(account));
  }

  // Initialize wallet
  useEffect(() => {
    const selectWallet = async newWallet => {
      if (newWallet.provider) {
        setInjectedProvider(new Web3Provider(newWallet.provider))
        window.localStorage.setItem('selectedWallet', newWallet.name)
      } else {
        setWallet(null)
      }
    }
    const config = {
      address: setAccount,
      wallet: selectWallet,
    }
    const onboard = initOnboard(config, isDarkMode())
    setNotify(initNotify())
    setOnboard(onboard)
  }, [])

  return (
    <NetworkContext.Provider
      value={{
        signerNetwork: network,
        signingProvider,
        usingBurnerProvider: !!burnerProvider,
        wallet: wallet,
        notify: notify,
        account: account,
        onNeedProvider: signingProvider ? undefined : selectWallet,
        onSelectWallet: selectWallet,
        onLogOut: logOut,
      }}
    >
      {children}
    </NetworkContext.Provider>
  )
}
