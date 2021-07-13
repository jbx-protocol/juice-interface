import { Web3Provider } from '@ethersproject/providers'
import BurnerProvider from 'burner-provider'
import { NETWORKS_BY_NAME } from 'constants/networks'
import { NetworkName } from 'models/network-name'
import { useMemo } from 'react'

export function useBurnerProvider() {
  return useMemo(() => {
    if (process.env.REACT_APP_INFURA_NETWORK !== NetworkName.localhost) return

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
    // eslint-disable-next-line no-underscore-dangle
    if (!process.env.REACT_APP_INFURA_ID) {
      console.log(
        'Missing env.REACT_APP_INFURA_ID! Cant create burner provider',
      )
      return undefined
    }
    burnerConfig.rpcUrl = NETWORKS_BY_NAME[NetworkName.localhost].rpcUrl
    return new Web3Provider(new BurnerProvider(burnerConfig))
  }, [])
}
