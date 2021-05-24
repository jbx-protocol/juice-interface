import { Button, Col, Popover, Row, Tag } from 'antd'
import { SUPPORTED_NETWORKS } from 'constants/supportedNetworks'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { NetworkName } from 'models/network-name'
import { useContext } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'
import { web3Modal } from 'utils/web3Modal'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress } = useContext(UserContext)
  const { onNeedProvider, signerNetwork } = useContext(NetworkContext)

  useDeepCompareEffect(() => {
    if (web3Modal.cachedProvider && onNeedProvider) {
      onNeedProvider()
    }
  }, [onNeedProvider])

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const switchNetworkTag =
    !signerNetwork ||
    signerNetwork === NetworkName.localhost ||
    (signerNetwork && SUPPORTED_NETWORKS.includes(signerNetwork)) ? null : (
      <Popover
        title="Juice works on:"
        content={
          <div>
            {SUPPORTED_NETWORKS.map(network => (
              <div key={network}>{network}</div>
            ))}
          </div>
        }
      >
        <Tag color="red">{signerNetwork} not supported</Tag>
      </Popover>
    )

  return (
    <div>
      <Row gutter={10} align="middle" style={{ justifyContent: 'flex-end' }}>
        {userAddress && (
          <Col>
            <Balance userAddress={userAddress} />
          </Col>
        )}
        {userAddress && (
          <Col>
            <Wallet userAddress={userAddress}></Wallet>
          </Col>
        )}
        <Col>
          {switchNetworkTag}
          {web3Modal?.cachedProvider ? (
            <Button onClick={logoutOfWeb3Modal}>Logout</Button>
          ) : (
            <Button onClick={onNeedProvider}>Connect</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
