import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { useWallet } from 'hooks/Wallet'
import LegalNoticeModal from 'components/modals/LegalNoticeModal'

import WalletMenu from './WalletMenu'
import { useEffect, useState } from 'react'

export default function WalletButton() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

  const [legalNoticeAccepted, setLegalNoticeAccepted] = useState<boolean>(
    localStorage.getItem('hasAcceptedLegalNotice') === 'true',
  )
  const [legalNoticeVisible, setLegalNoticeVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!legalNoticeVisible) {
      setLegalNoticeAccepted(
        localStorage.getItem('hasAcceptedLegalNotice') === 'true',
      )
    }
  }, [legalNoticeVisible])

  const onOk = () => {
    localStorage.setItem('hasAcceptedLegalNotice', 'true')
    setLegalNoticeAccepted(true)
    setLegalNoticeVisible(false)
  }

  if (!legalNoticeAccepted) {
    return (
      <>
        <Button onClick={() => setLegalNoticeVisible(true)} block>
          <Trans>Connect</Trans>
        </Button>
        <LegalNoticeModal open={legalNoticeVisible} onOk={onOk} />
      </>
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
