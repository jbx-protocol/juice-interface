import { Button, Col, Row, Tag } from 'antd'
import { readNetwork } from 'constants/networks'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'
import { web3Modal } from 'utils/web3Modal'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress } = useContext(UserContext)
  const { onNeedProvider, signerNetwork } = useContext(NetworkContext)

  const logoutOfWeb3Modal = async () => {
    await web3Modal.clearCachedProvider()
    setTimeout(() => {
      window.location.reload()
    }, 1)
  }

  const networkName = readNetwork.name

  const switchNetworkTag =
    signerNetwork && signerNetwork !== networkName ? (
      <Tag color="red">Switch to {networkName}</Tag>
    ) : null

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
          {onNeedProvider ? (
            <Button onClick={onNeedProvider}>Connect</Button>
          ) : (
            <Button onClick={logoutOfWeb3Modal}>Logout</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
