import { Web3Provider } from '@ethersproject/providers'
import { NETWORKS } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ChildElems } from 'models/child-elems'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useState } from 'react'
import { readNetwork } from 'constants/networks'

// TODO(odd-amphora): new stuff. organize
import { initOnboard, initNotify } from 'services'
import { API } from 'bnc-onboard/dist/src/interfaces'
import { Account } from 'bnc-notify'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'

export default function Network({ children }: { children: ChildElems }) {
  const { themeOption } = useContext(ThemeContext);

  const [signingProvider, setSigningProvider] = useState<Web3Provider>()
  const [network, setNetwork] = useState<NetworkName>()

  // TODO(odd-amphora): new.
  const [account, setAccount] = useState<Account>()
  const [wallet, setWallet] = useState<any>()
  const [onboard, setOnboard] = useState<API>()
  const [notify, setNotify] = useState<any>()

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
    setSigningProvider(undefined);
  }

  const accountChanged = () => {
    // TODO(odd-amphora): Needed?
    // if (account) {
    //   dispatch(accountUpdated(account, web3));
    // }
  }

  const dispatchConnectionConnected = () => {
    // TODO(odd-amphora): Needed?
    // dispatch(connectionConnected(account));
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

  // Initialize wallet
  useEffect(() => {
    const selectWallet = async newWallet => {
      if (newWallet.provider) {
        setSigningProvider(new Web3Provider(newWallet.provider))
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
        signingProvider: signingProvider && network === readNetwork.name ? signingProvider : undefined,
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
