import { SmallNftSquare } from 'components/ProjectDashboard/components/NftRewardsCard/SmallNftSquare'
import { ProjectCartNftReward } from 'components/ProjectDashboard/components/ProjectCartProvider'
import { useNftCartItem } from 'components/ProjectDashboard/hooks/useNftCartItem'
import { CartItem } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

export const NftCartItem: React.FC<ProjectCartNftReward> = reward => {
  const {
    price,
    name,
    quantity,
    fileUrl,
    removeNft,
    increaseQuantity,
    decreaseQuantity,
  } = useNftCartItem(reward)

  return (
    <CartItem
      title={
        <span className="flex items-center gap-2">
          <CartItemBadge>NFT</CartItemBadge>
          {name ?? 'Loading...'}
        </span>
      }
      quantity={quantity}
      price={price}
      icon={
        <SmallNftSquare
          className="h-14 w-14"
          nftReward={{
            fileUrl: fileUrl ?? '',
            name: name ?? '',
          }}
        />
      }
      onRemove={removeNft}
      onIncrease={increaseQuantity}
      onDecrease={decreaseQuantity}
    />
  )
}
