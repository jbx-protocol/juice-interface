import { ReactNode } from 'react'
import { JuiceVideoThumbnailOrImage } from './v2v3/shared/NftVideo/JuiceVideoThumbnailOrImage'

/**
 * Shows an {@link Image} with a small icon in the top left.
 */
export const IconedImage = ({
  url,
  widthClass,
  onClick,
  icon,
}: {
  url: string
  widthClass: string
  icon: ReactNode
  onClick: VoidFunction
}) => {
  return (
    <div className="relative py-4">
      <JuiceVideoThumbnailOrImage
        src={url}
        widthClass={widthClass}
        playIconPosition="hidden"
        showPreviewOnClick
      />
      <div
        className="absolute top-0 right-0 cursor-pointer"
        role="button"
        onClick={onClick}
      >
        {icon}
      </div>
    </div>
  )
}
