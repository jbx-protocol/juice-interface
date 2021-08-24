import { Layout, Modal, Space } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'
import { NetworkName } from 'models/network-name'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { initOnboard, initNotify } from 'services'
import ethers from 'ethers';
import Onboard from 'bnc-onboard'
import Web3 from 'web3';

import Navbar from './Navbar'
import Router from './Router'
import { API } from 'bnc-onboard/dist/src/interfaces'

let provider
let internalTransferContract
const internalTransferABI = [
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'to',
        type: 'address'
      }
    ],
    name: 'internalTransfer',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
]

function App() {
  const juiceTheme = useJuiceTheme()

  const [switchNetworkModalVisible, setSwitchNetworkModalVisible] =
    useState<boolean>()

  const [address, setAddress] = useState<any>();
  const [wallet, setWallet] = useState<any>();
  const [web3, setWeb3] = useState<any>();
  const [onboard, setOnboard] = useState<API>();

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

  const dispatchConnectionConnected = () => {
    // dispatch(connectionConnected(account));
  };

  useEffect(() => {
    const selectWallet = async (newWallet) => {
      if (newWallet.provider) {
        const newWeb3 = new Web3(newWallet.provider);
        newWeb3.eth.net.isListening().then(dispatchConnectionConnected);
        setWallet(newWallet);

        setWeb3(newWeb3);
        window.localStorage.setItem('selectedWallet', newWallet.name);
      } else {
        setWallet({});
      }
    };
    const config = {
      address: setAddress,
      wallet: selectWallet,
    }
    const onboard = initOnboard(config);
    // TODO(odd-amphora) init notify
    setOnboard(onboard)
  }, [])


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
        <div onClick={() => {
          onboard?.walletSelect()
        }}>hi</div>
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
