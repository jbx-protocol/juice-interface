import { PaymentMemoSticker } from './paymentMemoSticker'

export const AttachableSticker = ({
  sticker,
  onClick,
}: {
  sticker: PaymentMemoSticker
  onClick: VoidFunction
}) => {
  return (
    <div
      className="flex cursor-pointer content-center items-center justify-center py-4 hover:bg-smoke-75  dark:hover:bg-slate-400"
      role="button"
      onClick={onClick}
    >
      <img src={sticker.filepath} alt={sticker.alt} height="75px" />
    </div>
  )
}
