import { Trans } from '@lingui/macro'
import { signInKeyp } from '@usekeyp/js-sdk'
import { LoginPortal } from '@usekeyp/ui-kit'
import { Button, Modal } from 'antd'
import { useWallet } from 'hooks/Wallet'
import { useCallback, useState } from 'react'

import { WalletContext } from './WalletContext'

export const WalletProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [showWalletOptionModal, setShowWalletOptionModal] = useState<boolean>()
  const [showKeypLogin, setShowKeypLogin] = useState<boolean>()

  const { connect: connectEOAWallet } = useWallet()

  const connect = useCallback(() => setShowWalletOptionModal(true), [])

  return (
    <WalletContext.Provider value={{ connect }}>
      {children}

      <Modal
        title="Connect wallet"
        open={showWalletOptionModal}
        onCancel={() => setShowWalletOptionModal(false)}
        okButtonProps={{ hidden: true }}
        cancelText="Close"
        closable={false}
        destroyOnClose
        className="max-w-sm"
      >
        <div className="flex flex-col gap-4">
          <Button
            type="primary"
            onClick={() => {
              connectEOAWallet()
              setShowWalletOptionModal(false)
            }}
            block
          >
            <Trans>Ethereum wallet</Trans>
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowKeypLogin(true)
              setShowWalletOptionModal(false)
            }}
            block
          >
            <Trans>Keyp login</Trans>
          </Button>
        </div>
      </Modal>
      <Modal
        open={showKeypLogin}
        destroyOnClose
        closable={false}
        okButtonProps={{ hidden: true }}
        className="max-w-fit"
        onCancel={() => setShowKeypLogin(false)}
      >
        <LoginPortal
          providers={['GOOGLE', 'DISCORD', 'TWITTER']}
          onClick={(provider: string) => signInKeyp(provider)}
        />
      </Modal>
    </WalletContext.Provider>
  )
}
