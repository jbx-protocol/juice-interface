import { Trans } from '@lingui/macro'
import { useNftCartItem } from 'components/ProjectDashboard/hooks/useNftCartItem'
import { twMerge } from 'tailwind-merge'
import { CartItemBadge } from '../../Cart/components/CartItem/CartItemBadge'
import { SmallNftSquare } from '../../NftRewardsCard/SmallNftSquare'
import { ProjectCartNftReward } from '../../ProjectCartProvider'

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
