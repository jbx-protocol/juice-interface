import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const {
    onNeedProvider,
    userAddress,
    onLogOut
  } = useContext(NetworkContext)

  return (
    <div>
      <Row gutter={10} align="middle">
        {userAddress && (
          <Col>
            <Balance address={userAddress} showEthPrice />
          </Col>
        )}
        {userAddress && (
          <Col>
            <Wallet userAddress={userAddress}></Wallet>
          </Col>
        )}
        <Col>
          {onNeedProvider ? (
            <Button onClick={onNeedProvider}>Connect</Button>
          ) : (
            <Button onClick={onLogOut}>Logout</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
