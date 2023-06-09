import { CartItem, CartItemProps } from './CartItem'
import { CartItemBadge } from './CartItemBadge'

type NftCartItemProps = CartItemProps

// TODO
export const NftCartItem: React.FC<NftCartItemProps> = ({
  title,
  ...props
}) => {
  return (
    <CartItem
      title={
        <span className="flex items-center gap-2">
          <CartItemBadge>NFT</CartItemBadge>
          {title}
        </span>
      }
      quantity={1}
      {...props}
    />
  )
}
