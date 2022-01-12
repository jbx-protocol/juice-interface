import { Row, Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import React, { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Wallet from './Wallet'

export default function Account({ mobile }: { mobile?: boolean }) {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  return (
    <Row className="account-badge" gutter={10} align="middle">
      {!signingProvider ? (
        <div
          style={{
            marginLeft: mobile ? 'auto' : 10,
            marginTop: mobile ? -3 : -10,
          }}
        >
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
  )
}
