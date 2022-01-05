import { Col, Row, Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import React, { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Wallet from './Wallet'

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  return (
    <div>
      <Row gutter={10} align="middle">
        {!signingProvider ? (
          <div style={{ marginTop: -10 }}>
            <Button onClick={onSelectWallet}>
              <Trans>Connect</Trans>
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {userAddress && (
              <div style={{ marginTop: 0 }}>
                <Col>
                  <Wallet userAddress={userAddress}></Wallet>
                </Col>
              </div>
            )}
          </React.Fragment>
        )}
      </Row>
    </div>
  )
}
