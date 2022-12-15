import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useWallet } from 'hooks/Wallet'

import Wallet from './Wallet'

export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

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
      <Space>
        <Button
          className="border border-solid border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100"
          size="small"
          icon={<WarningOutlined className="text-warning-500" />}
          onClick={changeNetworks}
        >
          Wrong network
        </Button>

        <Wallet userAddress={userAddress} />
      </Space>
    )
  }

  return <Wallet userAddress={userAddress} />
}
