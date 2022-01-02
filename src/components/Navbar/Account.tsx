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
    <div className="account">
      <Col>
        {userAddress && (
          <Row>
            <Wallet userAddress={userAddress}></Wallet>
          </Row>
        )}
        {userAddress && (
          <Row>
            <Balance address={userAddress} showEthPrice />
          </Row>
        )}
        <Row>
          {!signingProvider ? (
            <Button onClick={onSelectWallet}>
              <Trans>Connect</Trans>
            </Button>
          ) : (
            <Button onClick={onLogOut}>
              <Trans>Sign out</Trans>
            </Button>
          )}
        </Row>
      </Col>
    </div>
  )
}
