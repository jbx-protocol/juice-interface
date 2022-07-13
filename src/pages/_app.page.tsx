import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { useRouter } from 'next/router'
import Navbar from 'components/Navbar'
import SEO from 'components/SEO'
import { NetworkContext } from 'contexts/networkContext'
import useMobile from 'hooks/Mobile'
import { NetworkName } from 'models/network-name'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import LanguageProvider from 'providers/LanguageProvider'
import { NetworkProvider } from 'providers/NetworkProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'
import { ThemeProvider } from 'providers/ThemeProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'

import { readNetwork } from 'constants/networks'

import '../styles/antd.css'
import '../styles/index.scss'

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
      <SEO
        title={'Juicebox'}
        siteTitle={'The Decentralized Funding Platform'}
        description={
          'Fund your thing with Juicebox. The funding platform for DAOs, decentralized crowdfunding, Web3 businesses and communities. Built on Ethereum.'
        }
      />
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
      <Head>
        <link rel="apple-touch-icon" href="/assets/juice_logo-ol.png" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&display=swap"
          rel="stylesheet"
        />

        <script
          async
          src="https://www.desmos.com/api/v1.6/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6"
        ></script>
        <script
          src="https://learned-hearty.juicebox.money/script.js"
          data-site="ERYRRJSV"
          defer
        ></script>
      </Head>
      <React.StrictMode>
        <ReactQueryProvider>
          <Provider store={store}>
            <LanguageProvider>
              <ThemeProvider>
                <NetworkProvider>
                  <V1UserProvider>
                    <AppWrapper>
                      <Component {...pageProps} />
                    </AppWrapper>
                  </V1UserProvider>
                </NetworkProvider>
              </ThemeProvider>
            </LanguageProvider>
          </Provider>
        </ReactQueryProvider>
      </React.StrictMode>
    </>
  )
}
