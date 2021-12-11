import { Button, Col, Row } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { signingProvider, userAddress, onSelectWallet, onLogOut } =
    useContext(NetworkContext)

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
          {!signingProvider ? (
            <Button onClick={onSelectWallet}>
              <Trans>Connect</Trans>
            </Button>
          ) : (
            <Button onClick={onLogOut}>
              <Trans>Sign out</Trans>
            </Button>
          )}
        </Col>
      </Row>
    </div>
  )
}
