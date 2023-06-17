import { SmallNftSquare } from 'components/ProjectDashboard/components/NftRewardsCard/SmallNftSquare'
import { ProjectCartNftReward } from 'components/ProjectDashboard/components/ProjectCartProvider'
import { useNftCartItem } from 'components/ProjectDashboard/hooks/useNftCartItem'
import { TruncatedText } from 'components/TruncatedText'
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
          <TruncatedText text={name ?? 'Loading...'} />
          <CartItemBadge>NFT</CartItemBadge>
        </span>
      }
      quantity={quantity}
      price={price}
      icon={
        <SmallNftSquare
          className="h-14 w-14 flex-shrink-0"
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
