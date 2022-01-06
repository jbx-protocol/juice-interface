import { Row, Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import React, { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Wallet from './Wallet'

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  return (
    <div className="account-dropdown">
      <Row gutter={10} align="middle">
        {!signingProvider ? (
          <div style={{ marginLeft: 10, marginTop: -10 }}>
            <Button onClick={onSelectWallet}>
              <Trans>Connect</Trans>
            </Button>
          </div>
        ) : (
          <React.Fragment>
            {userAddress && <Wallet userAddress={userAddress}></Wallet>}
          </React.Fragment>
        )}
      </Row>
    </div>
  )
}
