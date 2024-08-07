import { Trans } from '@lingui/macro'
import { CartItemBadge } from 'components/CartItemBadge'
import { SmallNftSquare } from 'components/NftRewards/SmallNftSquare'
import { useNftCartItem } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useNftCartItem'
import { twMerge } from 'tailwind-merge'
import { ProjectCartNftReward } from '../../../ReduxProjectCartProvider'

export const ReceiveNftItem = ({
  className,
  nftReward,
}: {
  className?: string
  nftReward: ProjectCartNftReward
}) => {
  const { fileUrl, name, quantity } = useNftCartItem(nftReward)

  return (
    <div className={twMerge('flex flex-col gap-4', className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center">
          <SmallNftSquare
            className="h-12 w-12"
            nftReward={{
              fileUrl: fileUrl ?? '',
              name: name ?? '',
            }}
          />
          <span className="ml-3">{name}</span>
          <CartItemBadge className="ml-2">
            <Trans>NFT</Trans>
          </CartItemBadge>
        </div>
        <div>{quantity}</div>
      </div>
    </div>
  )
}
