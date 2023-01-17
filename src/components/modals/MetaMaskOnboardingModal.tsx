import { t, Trans } from '@lingui/macro'
import { Modal, Button, Divider } from 'antd'
import ExternalLink from 'components/ExternalLink'
import MetaMaskOnboarding from '@metamask/onboarding'

export default function MetaMaskOnboardingModal({
  open,
  onCancel,
}: {
  open: boolean | undefined
  onCancel: VoidFunction | undefined
}) {
  return (
    <Modal
      open={open}
      onOk={() => window.location.reload()}
      okText={t`Reload`}
      okButtonProps={{ type: 'primary' }}
      onCancel={onCancel}
      centered
      destroyOnClose
    >
      <h3>
        <Trans>1. Set up your wallet</Trans>
      </h3>
      <p>
        <Trans>
          <ExternalLink href="https://ethereum.org/en/wallets/">
            Ethereum wallets
          </ExternalLink>{' '}
          let you interact with the Ethereum blockchain — you can use them to
          view your balance, send transactions, and connect to applications.
        </Trans>
      </p>
      <p>
        <Trans>
          MetaMask is a free wallet which works with almost all Ethereum
          applications. The button below will help you set up a MetaMask wallet.
        </Trans>
      </p>
      <Button
        onClick={() => new MetaMaskOnboarding().startOnboarding()}
        type="primary"
      >
        Set up MetaMask
      </Button>
      <Divider />
      <h3>
        <Trans>2. Connect to Juicebox</Trans>
      </h3>
      <p>
        <Trans>
          <ExternalLink href="https://ethereum.org/en/eth/">ETH</ExternalLink>{' '}
          is the main currency for Ethereum applications. You can buy ETH in
          MetaMask by opening the extension, signing in, and clicking "Buy".
        </Trans>
      </p>
      <p>
        <Trans>
          Once your wallet is funded with ETH, click "Reload Page" below to
          refresh the page. Then, connect your wallet to Juicebox by clicking
          "Connect".
        </Trans>
      </p>
      <p>
        <Trans>
          If you have issues or questions, ask for help in the{' '}
          <ExternalLink href="https://discord.gg/juicebox">
            Juicebox Discord
          </ExternalLink>
          .
        </Trans>
      </p>
      <Button onClick={() => window.location.reload()} type="primary">
        Reload page
      </Button>
    </Modal>
  )
}
