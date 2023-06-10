import { Trans } from '@lingui/macro'
import EthereumAddress from 'components/EthereumAddress'
import { usePayProjectModal } from 'components/ProjectDashboard/hooks/usePayProjectModal'
import { useProjectPaymentTokens } from 'components/ProjectDashboard/hooks/useProjectPaymentTokens'
import { ReceiveNftItem } from './ReceiveNftItem'
import { ReceiveTokensItem } from './ReceiveTokensItem'

export const ReceiveSection = ({ className }: { className?: string }) => {
  const { userAddress, nftRewards } = usePayProjectModal()
  const { receivedTickets } = useProjectPaymentTokens()

  if (nftRewards.length === 0 && receivedTickets === '0') {
    return null
  }

  return (
    <div className={className}>
      <span className="font-medium">
        <Trans>Receive</Trans>
      </span>
      <div className="mt-2 flex justify-between gap-3">
        <span className="text-grey-500 dark:text-slate-200">
          <Trans>
            NFTs, tokens and rewards will be sent to{' '}
            <EthereumAddress
              className="text-grey-900 dark:text-slate-100"
              address={userAddress}
            />
          </Trans>
        </span>
        <a role="button">
          <Trans>Edit</Trans>
        </a>
      </div>
      <ReceiveTokensItem className="mt-5" />
      {nftRewards.map(nftReward => (
        <ReceiveNftItem
          key={nftReward.id}
          nftReward={nftReward}
          className="mt-5"
        />
      ))}
    </div>
  )
}
