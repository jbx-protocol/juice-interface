import { WarningOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { LegalNoticeModal } from 'components/modals/LegalNoticeModal'
import { useWallet } from 'hooks/Wallet'
import { useEffect, useState } from 'react'
import WalletMenu from './WalletMenu'

const LEGAL_NOTICE_STORAGE_KEY = 'jbm_hasAcceptedLegalNotice'

export function WalletButton() {
  const {
    userAddress,
    isConnected,
    connect,
    chainUnsupported,
    changeNetworks,
  } = useWallet()

  const [legalNoticeAccepted, setLegalNoticeAccepted] = useState<boolean>(false)
  const [legalNoticeVisible, setLegalNoticeVisible] = useState<boolean>(false)

  // set initial state
  useEffect(() => {
    try {
      const localStorageState = localStorage.getItem(LEGAL_NOTICE_STORAGE_KEY)
      const isLegalNoticeAccepted = Boolean(
        JSON.parse(localStorageState ?? 'false'),
      )

      setLegalNoticeAccepted(isLegalNoticeAccepted)
    } catch (error) {
      return
    }
  }, [])

  const onOk = () => {
    localStorage.setItem(LEGAL_NOTICE_STORAGE_KEY, 'true')
    setLegalNoticeAccepted(true)
    setLegalNoticeVisible(false)
    connect()
  }

  if (!legalNoticeAccepted) {
    return (
      <>
        <Button
          onClick={() => {
            setLegalNoticeVisible(true)
          }}
          block
        >
          <Trans>Connect</Trans>
        </Button>
        <LegalNoticeModal
          open={legalNoticeVisible}
          onOk={onOk}
          onCancel={() => {
            setLegalNoticeVisible(false)
          }}
        />
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
