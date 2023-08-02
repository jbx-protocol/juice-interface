import { Trans } from '@lingui/macro'
import { signInKeyp } from '@usekeyp/js-sdk'
import { LoginPortal } from '@usekeyp/ui-kit'
import { Button, Modal } from 'antd'
import { useWallet } from 'hooks/Wallet'
import { signOut } from 'next-auth/react'
import { useMemo, useState } from 'react'

import { FEATURE_FLAGS } from 'constants/featureFlags'
import { featureFlagEnabled } from 'utils/featureFlags'
import { WalletContext } from './WalletContext'

export const WalletProvider: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState<boolean>()
  const [showKeypLogin, setShowKeypLogin] = useState<boolean>()

  const { connect: connectEOAWallet, disconnect, isConnected } = useWallet()

  const enabled = featureFlagEnabled(FEATURE_FLAGS.KEYP_WALLET)

  const connect = useMemo(
    () => (enabled ? () => setShowSelectWalletModal(true) : connectEOAWallet),
    [enabled, connectEOAWallet],
  )

  return (
    <WalletContext.Provider value={{ connect }}>
      {children}

      <Modal
        title="Connect wallet"
        open={showSelectWalletModal}
        onCancel={() => setShowSelectWalletModal(false)}
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
              connectEOAWallet().then(() => {
                // Signout of keyp. Ensure only one wallet is connected at a time
                signOut()
              })

              setShowSelectWalletModal(false)
            }}
            block
          >
            <Trans>Ethereum wallet</Trans>
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setShowKeypLogin(true)
              setShowSelectWalletModal(false)
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
          onClick={(provider: string) => {
            signInKeyp(provider)

            // Disconnect EOA wallet. Ensure only one wallet is connected at a time
            if (isConnected) disconnect()
          }}
        />
      </Modal>
    </WalletContext.Provider>
  )
}
