import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { UserContext } from 'contexts/userContext'
import { useContext } from 'react'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress } = useContext(UserContext)
  const {
    onNeedProvider,
    usingBurnerProvider,
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
          {onNeedProvider || usingBurnerProvider ? (
            <Button onClick={onNeedProvider}>Connect</Button>
          ) : (
            <Button onClick={onLogOut}>Logout</Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
