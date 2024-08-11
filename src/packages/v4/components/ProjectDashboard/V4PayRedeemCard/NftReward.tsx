// const NftReward: React.FC<{
//   nft: ProjectCartNftReward
//   className?: string
// }> = ({ nft, className }) => {
//   const {
//     price,
//     name,
//     quantity,
//     fileUrl,
//     removeNft,
//     increaseQuantity,
//     decreaseQuantity,
//   } = useNftCartItem(nft)

//   const handleRemove = useCallback(() => {
//     emitConfirmationDeletionModal({
//       onConfirm: removeNft,
//       title: t`Remove NFT`,
//       description: t`Are you sure you want to remove this NFT?`,
//     })
//   }, [removeNft])

//   const handleDecreaseQuantity = useCallback(() => {
//     if (quantity - 1 <= 0) {
//       handleRemove()
//     } else {
//       decreaseQuantity()
//     }
//   }, [decreaseQuantity, handleRemove, quantity])

//   const priceText = price === null ? '-' : formatCurrencyAmount(price)

//   return (
//     <div className={twMerge('flex items-center justify-between', className)}>
//       <div className="flex items-center gap-3">
//         <SmallNftSquare
//           className="h-12 w-12"
//           nftReward={{
//             fileUrl: fileUrl ?? '',
//             name: name ?? '',
//           }}
//         />
//         <div className="flex flex-col">
//           <div className="flex items-center gap-2">
//             <TruncatedText
//               className="max-w-[70%] text-sm font-medium text-grey-900 hover:underline dark:text-slate-100"
//               text={name}
//             />
//             <CartItemBadge>NFT</CartItemBadge>
//           </div>

//           <div className="text-xs">{priceText}</div>
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <QuantityControl
//           quantity={quantity}
//           onIncrease={increaseQuantity}
//           onDecrease={handleDecreaseQuantity}
//         />
//         <RemoveIcon onClick={handleRemove} />
//       </div>
//     </div>
//   )
// }

// const RemoveIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
//   <TrashIcon
//     data-testid="cart-item-remove-button"
//     role="button"
//     className="inline h-6 w-6 text-grey-400 dark:text-slate-300 md:h-4 md:w-4"
//     onClick={onClick}
//   />
// )

// const QuantityControl: React.FC<{
//   quantity: number
//   onIncrease: () => void
//   onDecrease: () => void
// }> = ({ quantity, onIncrease, onDecrease }) => {
//   return (
//     <span className="flex w-fit gap-3 rounded-lg border border-grey-200 p-1 text-sm dark:border-slate-600">
//       <button data-testid="cart-item-decrease-button" onClick={onDecrease}>
//         <MinusIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
//       </button>
//       {quantity}
//       <button data-testid="cart-item-increase-button" onClick={onIncrease}>
//         <PlusIcon className="h-4 w-4 text-grey-500 dark:text-slate-200" />
//       </button>
//     </span>
//   )
// }
