import { TruncatedText } from 'components/TruncatedText'
import { ProjectCartNftReward } from 'components/v2v3/V2V3Project/ProjectDashboard/components/ProjectCartProvider/ProjectCartProvider'
import { SmallNftSquare } from 'components/v2v3/V2V3Project/ProjectDashboard/components/SmallNftSquare'
import { useNftCartItem } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/useNftCartItem'
import { handleConfirmationDeletion } from 'components/v2v3/V2V3Project/ProjectDashboard/utils/modals'
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
      onRemove={handleConfirmationDeletion({
        type: 'NFT',
        onConfirm: removeNft,
      })}
      onIncrease={increaseQuantity}
      onDecrease={decreaseQuantity}
    />
  )
}
