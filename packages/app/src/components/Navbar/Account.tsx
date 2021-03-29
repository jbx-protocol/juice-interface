import { Button, Col, Popover, Row, Tag } from 'antd'
import { supportedNetworks } from 'constants/supported-networks'
import { web3Modal } from 'constants/web3-modal'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import useDeepCompareEffect from 'use-deep-compare-effect'

import Balance from './Balance'
import Wallet from './Wallet'
import { NetworkName } from 'models/network-name'

export default function Account() {
  const { onNeedProvider, userAddress, network } = useContext(UserContext)

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
    !network ||
    network === NetworkName.localhost ||
    (network && supportedNetworks.includes(network)) ? null : (
      <Popover
        title="Juice works on:"
        content={
          <div>
            {supportedNetworks.map(network => (
              <div key={network}>{network}</div>
            ))}
          </div>
        }
      >
        <Tag color="red">Network not supported</Tag>
      </Popover>
    )

  return (
    <div>
      <Row gutter={10} align="middle" style={{ justifyContent: 'flex-end' }}>
        <Col>
          <Balance userAddress={userAddress} />
        </Col>
        <Col>
          <Wallet userAddress={userAddress}></Wallet>
        </Col>
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
