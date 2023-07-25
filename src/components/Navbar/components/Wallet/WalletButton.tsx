import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useJBWallet } from 'hooks/Wallet'

import WalletMenu from './WalletMenu'

export default function WalletButton() {
  const { eoa, isConnected, userAddress, connect } = useJBWallet()
  const { chainUnsupported, changeNetworks } = eoa

  if (!isConnected) {
    return (
      <div>
        <Button onClick={connect} block>
          <Trans>Connect</Trans>
        </Button>
      </div>
    )
  }

  if (!userAddress) return null

  return (
    <div className="flex items-center gap-2">
      {chainUnsupported && (
        <Button
          className="border border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100"
          size="small"
          icon={<WarningOutlined className="text-warning-500" />}
          onClick={changeNetworks}
        >
          <span className="md:hidden lg:inline">Wrong network</span>
        </Button>
      )}

      <WalletMenu userAddress={userAddress} />
    </div>
  )
}
