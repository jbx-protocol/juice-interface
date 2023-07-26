import { Trans } from '@lingui/macro'
import useMobile from 'hooks/useMobile'
import { useJBWallet } from 'hooks/Wallet'

export function DeployButtonText() {
  const isMobile = useMobile()
  const {
    isConnected,
    eoa: { chainUnsupported, chain },
  } = useJBWallet()

  if (chainUnsupported) {
    return isMobile ? (
      <Trans>Change network</Trans>
    ) : (
      <Trans>Change networks to deploy</Trans>
    )
  }

  if (!isConnected) {
    return isMobile ? (
      <Trans>Connect wallet</Trans>
    ) : (
      <Trans>Connect wallet to deploy</Trans>
    )
  }

  if (chain?.name && !isMobile) {
    return <Trans>Deploy project to {chain?.name}</Trans>
  }

  return <Trans>Deploy project</Trans>
}
