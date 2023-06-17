import { ImageProps } from 'next/image'
import { ReactNode } from 'react'
import { JuiceVideoThumbnailOrImage } from './JuiceVideo/JuiceVideoThumbnailOrImage'

/**
 * Shows an {@link Image} with a small icon in the top left.
 */
export const IconedImage = ({
  imageClassName,
  src,
  onIconClick,
  icon,
  ...props
}: {
  imageClassName?: string
  src: string
  icon: ReactNode
  onIconClick?: VoidFunction
} & ImageProps) => {
  return (
    <div className="relative py-4">
      <JuiceVideoThumbnailOrImage
        src={src}
        className={imageClassName}
        playIconPosition="hidden"
        showPreviewOnClick
        {...props}
      />
      <div
        className="absolute top-0 right-0 cursor-pointer"
        role="button"
        onClick={onIconClick}
      >
        {icon}
      </div>
    </div>
  )
}
