import Image from 'next/image'
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
      <Image
        src={sticker.filepath}
        alt={sticker.alt}
        height={75}
        width={75}
        style={{
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  )
}
