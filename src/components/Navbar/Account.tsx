import { Row, Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import React, { CSSProperties, useContext } from 'react'
import { Trans } from '@lingui/macro'

import Wallet from './Wallet'

export default function Account({ mobile }: { mobile?: boolean }) {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  const mobileStyles: CSSProperties = {
    marginLeft: 'auto',
    width: '100%',
    textAlign: 'center',
  }

  const desktopStyles: CSSProperties = {
    marginLeft: 10,
    marginTop: 0,
  }

  return (
    <Row
      gutter={10}
      align="middle"
      style={
        mobile
          ? {
              margin: 'auto',
              marginTop: 22,
            }
          : {}
      }
    >
      {!signingProvider ? (
        <div style={mobile ? mobileStyles : desktopStyles}>
          <Button onClick={onSelectWallet}>
            <Trans>Connect</Trans>
          </Button>
        </div>
      ) : (
        <React.Fragment>
          {userAddress && <Wallet userAddress={userAddress} />}
        </React.Fragment>
      )}
    </Row>
  )
}
