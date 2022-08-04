import Navbar from 'components/Navbar'
import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import useMobile from 'hooks/Mobile'
import { NetworkName } from 'models/network-name'
import { useRouter } from 'next/router'
import LanguageProvider from 'providers/LanguageProvider'
import ReactQueryProvider from 'providers/ReactQueryProvider'
import { V1UserProvider } from 'providers/v1/UserProvider'
import React, { useState } from 'react'
import { Provider } from 'react-redux'
import { ThemeProvider } from 'providers/ThemeProvider'
import store from 'redux/store'
import { redirectTo } from 'utils/windowUtils'

import { readNetwork } from 'constants/networks'

/**
 * Contains all the core app providers used by each page.
 *
 * This is currently embedded on each page individually. This decision was made
 * as the current language provider doesn't support pre-rendering. Pre-rendering
 * is still an issue, but the current structure allows opengraph and twitter
 * meta tags to be setup correctly.
 */
export const AppWrapper: React.FC = ({ children }) => {
  return (
    <React.StrictMode>
      <ReactQueryProvider>
        <Provider store={store}>
          <LanguageProvider>
            <ThemeProvider>
              {/* TODO: Remove v1 provider */}
              <V1UserProvider>
                <_Wrapper>{children}</_Wrapper>
              </V1UserProvider>
            </ThemeProvider>
          </LanguageProvider>
        </Provider>
      </ReactQueryProvider>
    </React.StrictMode>
  )
}

const _Wrapper: React.FC = ({ children }) => {
  const [switchNetworkModalVisible] = useState<boolean>()

  const router = useRouter()
  if (router.asPath.match(/^\/#\//)) {
    redirectTo(router.asPath.replace('/#/', ''))
  }

  // TODO
  // const { signerNetwork, userAddress } = useContext(NetworkContext)

  const isMobile = useMobile()

  const networkName = readNetwork.name

  const supportedNetworks: NetworkName[] = [
    NetworkName.mainnet,
    NetworkName.rinkeby,
  ]

  // useEffect(() => {
  //   if (!signerNetwork || !userAddress) return

  //   setSwitchNetworkModalVisible(signerNetwork !== networkName)
  // }, [networkName, signerNetwork, userAddress])

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
