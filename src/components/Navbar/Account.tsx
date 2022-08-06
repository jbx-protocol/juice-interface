import { Button, Space } from 'antd'
import { NetworkContext } from 'contexts/networkContext'

import { useContext } from 'react'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

import Wallet from './Wallet'

export default function Account() {
  const { userAddress, onSelectWallet, shouldSwitchNetwork, walletIsReady } =
    useContext(NetworkContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!userAddress) {
    return (
      <Button onClick={onSelectWallet} block>
        <Trans>Connect</Trans>
      </Button>
    )
  }

  if (!userAddress) return null

  if (shouldSwitchNetwork) {
    return (
      <Space direction="horizontal">
        {shouldSwitchNetwork && (
          <Button
            size="small"
            style={{
              borderColor: colors.stroke.warn,
              color: colors.text.warn,
            }}
            onClick={walletIsReady}
          >
            Wrong network
          </Button>
        )}
        <Wallet userAddress={userAddress} />
      </Space>
    )
  }

  return <Wallet userAddress={userAddress} />
}
