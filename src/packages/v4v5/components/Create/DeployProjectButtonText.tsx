import { Trans } from '@lingui/macro'
import useMobile from 'hooks/useMobile'
import { useWallet } from 'hooks/Wallet'

export function DeployProjectButtonText() {
  const isMobile = useMobile()
  const { isConnected } = useWallet()

  if (!isConnected) {
    return isMobile ? (
      <Trans>Connect wallet</Trans>
    ) : (
      <Trans>Connect wallet to deploy</Trans>
    )
  }

  return <Trans>Launch project</Trans>
}
