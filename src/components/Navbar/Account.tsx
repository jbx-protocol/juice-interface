import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import { useWallet } from 'hooks/Wallet'
import MetaMaskOnboardingModal from 'components/modals/MetaMaskOnboardingModal'
import { useState } from 'react'

import Wallet from './Wallet'

export default function Account() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

  if (!window.ethereum) {
    const [metaMaskOnboardingModalVisible, setMetaMaskOnboardingModalVisible] =
      useState<boolean>(false)

    return (
      <div className="flex items-center gap-6">
        <Button onClick={() => setMetaMaskOnboardingModalVisible(true)} block>
          <Trans>Create a Wallet</Trans>
        </Button>
        <Button onClick={() => connect()} block>
          <Trans>Connect</Trans>
        </Button>
        <MetaMaskOnboardingModal
          open={metaMaskOnboardingModalVisible}
          onCancel={() => setMetaMaskOnboardingModalVisible(false)}
        />
      </div>
    )
  }

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
