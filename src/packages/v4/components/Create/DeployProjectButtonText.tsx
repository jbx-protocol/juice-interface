import { Trans } from '@lingui/macro'
import useMobile from 'hooks/useMobile'
import { useWallet } from 'hooks/Wallet'
import { useAppSelector } from 'redux/hooks/useAppSelector'

export function DeployProjectButtonText() {
  const isMobile = useMobile()
  const { isConnected, chain } = useWallet()

  const { projectChainId } = useAppSelector(state => state.creatingV2Project)

  const walletConnectedToWrongChain =
    chain?.id && projectChainId !== parseInt(chain.id)

  if (!isConnected) {
    return isMobile ? (
      <Trans>Connect wallet</Trans>
    ) : (
      <Trans>Connect wallet to deploy</Trans>
    )
  }

  if (walletConnectedToWrongChain) {
    return isMobile ? (
      <Trans>Change network</Trans>
    ) : (
      <Trans>Change networks to deploy</Trans>
    )
  }

  return <Trans>Launch project</Trans>
}
