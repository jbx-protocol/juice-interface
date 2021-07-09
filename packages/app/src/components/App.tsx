import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import { useContext, useLayoutEffect, useState } from 'react'

import Navbar from './Navbar'
import Router from './Router'
import { NetworkName } from 'models/network-name'

function App() {
  const juiceTheme = useJuiceTheme()

  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] = useState<
    boolean
  >()

  const { signerNetwork } = useContext(NetworkContext)

  const networkName = readNetwork.name

  const supportedNetworks: NetworkName[] = [
    NetworkName.kovan,
    NetworkName.rinkeby,
  ]

  useLayoutEffect(() => {
    if (!signerNetwork) return

    setSwitchNetworkModalVisible(signerNetwork !== networkName)
  }, [setSwitchNetworkModalVisible, signerNetwork])

  return (
    <ThemeContext.Provider value={juiceTheme}>
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
              .filter(n => !window.location.hostname.includes(n))
              .map(_n => (
                <a key={_n} href={`https://${_n}.juicebox.money`}>
                  {_n}.juicebox.money
                </a>
              ))}
          </Space>
        </div>
      </Modal>
    </ThemeContext.Provider>
  )
}

export default App
