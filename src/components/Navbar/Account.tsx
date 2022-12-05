import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useWallet } from 'hooks/Wallet'

import Wallet from './Wallet'

import { BigNumber } from '@ethersproject/bignumber'
import coinbaseWalletModule from '@web3-onboard/coinbase'
import gnosisModule from '@web3-onboard/gnosis'
import injectedModule from '@web3-onboard/injected-wallets'
import keystoneModule from '@web3-onboard/keystone'
import ledgerModule from '@web3-onboard/ledger'
import { init, useAccountCenter, useWallets } from '@web3-onboard/react'
import trezorModule from '@web3-onboard/trezor'
import walletConnectModule from '@web3-onboard/walletconnect'
import config from 'config/seo_meta.json'
import { NETWORKS } from 'constants/networks'
import {
  useLoadWalletFromLocalStorage,
  useStoreWalletsInLocalStorage,
} from 'hooks/Network'
import React, { useEffect } from 'react'
import { unpadLeadingZerosString } from 'utils/bigNumbers'

import { installJuiceboxWindowObject } from 'lib/juicebox'

const injected = injectedModule()
const gnosis = gnosisModule()
const ledger = ledgerModule()
const trezor = trezorModule({
  appUrl: 'https://juicebox.money/',
  email: 'me.jango@protonmail.com',
})
const keystone = keystoneModule()
const walletConnect = walletConnectModule()
const coinbaseWalletSdk = coinbaseWalletModule()

export const walletsInit = init({
  wallets: [
    injected,
    gnosis,
    ledger,
    trezor,
    keystone,
    walletConnect,
    coinbaseWalletSdk,
  ],
  chains: Object.values(NETWORKS).map(n => ({
    id: unpadLeadingZerosString(BigNumber.from(n.chainId).toHexString()),
    rpcUrl: n.rpcUrl,
    token: n.token ?? 'ETH',
    label: n.label,
  })),
  appMetadata: {
    icon: '/assets/juice_logo-ol.png',
    name: config.title,
    description: config.description,
  },
})
export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

  const updateAccountCenter = useAccountCenter()
  const loadWalletFromLocalStorage = useLoadWalletFromLocalStorage()
  const storeWalletsInLocalStorage = useStoreWalletsInLocalStorage()
  const connectedWallets = useWallets()

  // Load any previously connected wallets
  useEffect(() => {
    loadWalletFromLocalStorage()
  }, [loadWalletFromLocalStorage])

  // store any wallets
  useEffect(() => {
    storeWalletsInLocalStorage(connectedWallets)
  }, [storeWalletsInLocalStorage, connectedWallets])

  // disable account center in web3-onboard
  useEffect(() => {
    updateAccountCenter({ enabled: false })
  }, [updateAccountCenter])

  // run on initial mount
  useEffect(() => {
    installJuiceboxWindowObject()
  }, [])

  if (!isConnected) {
    return (
      <Button onClick={() => connect()} block>
        <Trans>Connect</Trans>
      </Button>
    )
  }

  if (!userAddress) return null

  if (chainUnsupported) {
    return (
      <Space>
        <Button
          className="border border-solid border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100"
          size="small"
          icon={<WarningOutlined className="text-warning-500" />}
          onClick={changeNetworks}
        >
          Wrong network
        </Button>

        <Wallet userAddress={userAddress} />
      </Space>
    )
  }

  return <Wallet userAddress={userAddress} />
}
