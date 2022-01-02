import { Col, Row, Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import React, { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Balance from './Balance'
import Wallet from './Wallet'

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  return (
    <div>
      <Row gutter={10} align="middle">
        {!signingProvider ? (
          <Button onClick={onSelectWallet}>
            <Trans>Connect</Trans>
          </Button>
        ) : (
          <React.Fragment>
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
          </React.Fragment>
        )}
      </Row>
    </div>
  )
}
