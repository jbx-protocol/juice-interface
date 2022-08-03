import type { AppProps } from 'next/app'
import React from 'react'
import { Head } from 'components/common'
import { NetworkProvider } from 'providers/NetworkProvider'

import '../styles/antd.css'
import '../styles/index.scss'

<<<<<<< HEAD
=======
// TODO: Move this to each page where needed.
const AppWrapper: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
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

  useEffect(() => {
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

>>>>>>> 0aae3e90 (update types for react 18)
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Default HEAD - overwritten by specific page SEO */}
      <Head />
      <NetworkProvider>
        <Component {...pageProps} />
      </NetworkProvider>
    </>
  )
}
