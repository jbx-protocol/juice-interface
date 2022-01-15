import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'

import { NetworkContext } from 'contexts/networkContext'
import { NetworkName } from 'models/network-name'
import { useContext, useLayoutEffect, useState } from 'react'

import Navbar from 'components/Navbar'

import { readNetwork } from 'constants/networks'

import Router from './Router'

function App() {
  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] =
    useState<boolean>()

  const { signerNetwork } = useContext(NetworkContext)

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
        <Content>
          <Router />
        </Content>
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
              .filter(n => process.env.REACT_APP_INFURA_NETWORK !== n)
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

export default App
