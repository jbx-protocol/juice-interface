import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useRouter } from 'next/router'
import Navbar from 'components/Navbar'
import { NetworkContext } from 'contexts/networkContext'
import useMobile from 'hooks/Mobile'
import { NetworkName } from 'models/network-name'
import type { AppProps } from 'next/app'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { CoreAppWrapper, Head } from 'components/common'

import { readNetwork } from 'constants/networks'

import '../styles/antd.css'
import '../styles/index.scss'

// TODO: Move this to each page where needed.
const AppWrapper: React.FC = ({ children }) => {
  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] =
    useState<boolean>()

  const router = useRouter()
  if (router.asPath.match(/^\/#\//)) {
    router.push(router.asPath.replace('/#/', ''))
  }

  const { signerNetwork } = useContext(NetworkContext)

  const isMobile = useMobile()

  const networkName = readNetwork.name

  const supportedNetworks: NetworkName[] = [
    NetworkName.mainnet,
    NetworkName.rinkeby,
  ]

  useLayoutEffect(() => {
    if (!signerNetwork) return

    setSwitchNetworkModalVisible(signerNetwork !== networkName)
  }, [networkName, signerNetwork])

  return (
    <>
      <Layout
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        <Navbar />
        <Content style={isMobile ? { paddingTop: 40 } : {}}>{children}</Content>
      </Layout>

      <Modal
        visible={switchNetworkModalVisible}
        centered
        closable={false}
        footer={null}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
          }}
        >
          <Space direction="vertical">
            <h2>Connect wallet to {networkName}</h2>
            <div>Or, go to:</div>
            {supportedNetworks
              .filter(n => process.env.NEXT_PUBLIC_INFURA_NETWORK !== n)
              .map(_n => {
                const subDomain = _n === NetworkName.mainnet ? '' : _n + '.'

                return (
                  <a key={_n} href={`https://${subDomain}juicebox.money`}>
                    {subDomain}juicebox.money
                  </a>
                )
              })}
          </Space>
        </div>
      </Modal>
    </>
  )
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head />
      <CoreAppWrapper>
        <AppWrapper>
          <Component {...pageProps} />
        </AppWrapper>
      </CoreAppWrapper>
    </>
  )
}
