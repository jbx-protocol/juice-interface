import { Trans } from '@lingui/macro'
import { useWallet } from 'hooks/Wallet'
import { useNetwork } from 'wagmi'

export function ButtonText() {
  const { isConnected, chainUnsupported } = useWallet()
  const { chain } = useNetwork()

  if (chainUnsupported) {
    return <Trans>Change networks to deploy</Trans>
  }

  if (!isConnected) {
    return <Trans>Connect wallet to deploy</Trans>
  }

  if (chain?.name) {
    return <Trans>Deploy project to {chain?.name}</Trans>
  }

  return <Trans>Deploy project</Trans>
}
