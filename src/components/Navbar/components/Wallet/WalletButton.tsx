import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { LegalNoticeModal } from 'components/modals/LegalNoticeModal'
import { useWallet } from 'hooks/Wallet'
import { useEffect, useState } from 'react'
import WalletMenu from './WalletMenu'

const LEGAL_NOTICE_STORAGE_KEY = 'jbm_hasAcceptedLegalNotice'

export function WalletButton() {
  const { userAddress, isConnected, connect } = useWallet()

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

  return <WalletMenu userAddress={userAddress} />
}
