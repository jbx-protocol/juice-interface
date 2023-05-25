import { CloseCircleFilled } from '@ant-design/icons'
import { IconedImage } from 'components/IconedImage'
import { ipfsUriToGatewayUrl } from 'utils/ipfs'

export const StickerSelection = ({
  value,
  onChange,
}: {
  value?: string[]
  onChange?: (value: string[]) => void
}) => {
  const handleImageDeletion = (i: number) => {
    if (!value) {
      onChange?.([])
      return
    }
    const editedImages = [...value.slice(0, i), ...value.slice(i + 1)]
    onChange?.(editedImages)
  }

  return (
    <div className="flex gap-2 pt-3">
      {value?.map((url, i) => (
        <IconedImage
          alt="Sticker image"
          key={`${i}-${url}`}
          src={ipfsUriToGatewayUrl(url)}
          widthClass="w-14"
          icon={
            <CloseCircleFilled className="text-base text-black dark:text-slate-100" />
          }
          onIconClick={() => handleImageDeletion(i)}
        />
      ))}
    </div>
  )
}
