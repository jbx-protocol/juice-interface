import { Button } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import { useContext } from 'react'
import { Trans } from '@lingui/macro'

import Wallet from './Wallet'

export default function Account() {
  const { userAddress, signingProvider, onSelectWallet } =
    useContext(NetworkContext)

  if (!signingProvider) {
    return (
      <Button onClick={onSelectWallet} block>
        <Trans>Connect</Trans>
      </Button>
    )
  }

  if (!userAddress) return null

  return <Wallet userAddress={userAddress} />
}
