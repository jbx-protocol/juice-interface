import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

import Wallet from './Wallet'

export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (!isConnected) {
    return (
      <Button onClick={() => connect()} block>
        <Trans>Connect</Trans>
      </Button>
    )
  }

  if (!userAddress) return null

  if (chainUnsupported) {
    return (
      <Space direction="horizontal">
        {chainUnsupported && (
          <Button
            size="small"
            icon={<WarningOutlined style={{ color: colors.icon.warn }} />}
            style={{
              backgroundColor: colors.background.warn,
              borderColor: colors.stroke.warn,
              color: colors.text.warn,
            }}
            onClick={changeNetworks}
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
