import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const {
    onNeedProvider,
    signingProvider,
    account,
    onLogOut
  } = useContext(NetworkContext)

  return (
    <div>
      <Row gutter={10} align="middle">
        {account && (
          <Col>
            <Balance address={account?.toString()} showEthPrice />
          </Col>
        )}
        {account && (
          <Col>
            <Wallet userAddress={account?.toString()}></Wallet>
          </Col>
        )}
        <Col>
          {signingProvider ? (
            <Button onClick={onLogOut}>Logout</Button>
          ) : (
            <Button onClick={onNeedProvider}>Connect</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
