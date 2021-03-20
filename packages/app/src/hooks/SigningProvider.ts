import { Web3Provider } from '@ethersproject/providers'
import BurnerProvider from 'burner-provider'
import { readProvider } from 'constants/read-provider'
import { UserContext } from 'contexts/userContext'
import { NetworkName } from 'models/network-name'
import { useContext, useMemo } from 'react'

export function useSigningProvider(injectedProvider?: Web3Provider) {
  const { network } = useContext(UserContext)

  return useMemo(() => {
    if (injectedProvider) {
      console.log('🦊 Using injected provider')
      return injectedProvider
    }
    if (
      process.env.NODE_ENV === 'production' ||
      (process.env.REACT_APP_INFURA_DEV_NETWORK &&
        process.env.REACT_APP_INFURA_DEV_NETWORK !== NetworkName.localhost)
    )
      return

    let burnerConfig: {
      privateKey?: string
      rpcUrl?: string
    } = {}

    if (window.location?.pathname?.indexOf('/pk') >= 0) {
      const incomingPK = window.location.hash.replace('#', '')
      console.log('incomingpk', incomingPK)
      let rawPK
      if (incomingPK.length === 64 || incomingPK.length === 66) {
        console.log('🔑 Incoming Private Key...')
        rawPK = incomingPK
        burnerConfig.privateKey = rawPK
        window.history.pushState({}, '', '/')
        let currentPrivateKey = window.localStorage.getItem('metaPrivateKey')
        if (currentPrivateKey && currentPrivateKey !== rawPK) {
          window.localStorage.setItem(
            'metaPrivateKey_backup' + Date.now(),
            currentPrivateKey,
          )
        }
        window.localStorage.setItem('metaPrivateKey', rawPK)
      }
    }

    console.log('🔥 Using burner provider', burnerConfig)
    const _readProvider = readProvider(network)
    if (_readProvider.connection && _readProvider.connection.url) {
      burnerConfig.rpcUrl = _readProvider.connection.url
      return new Web3Provider(new BurnerProvider(burnerConfig))
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const networkName = _readProvider._network && _readProvider._network.name
      if (!process.env.REACT_APP_INFURA_ID) {
        console.log(
          'Missing env.REACT_APP_INFURA_ID! Cant create burner provider',
        )
        return undefined
      }
      burnerConfig.rpcUrl = `https://${networkName || 'mainnet'}.infura.io/v3/${
        process.env.REACT_APP_INFURA_ID
      }`
      return new Web3Provider(new BurnerProvider(burnerConfig))
    }
  }, [injectedProvider, network])
}
