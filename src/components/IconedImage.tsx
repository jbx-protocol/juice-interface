import { Image } from 'antd'
import { ReactNode } from 'react'

/**
 * Shows an {@link Image} with a small icon in the top left.
 */
export const IconedImage = ({
  url,
  width,
  onClick,
  icon,
}: {
  url: string
  width: number
  icon: ReactNode
  onClick: VoidFunction
}) => {
  return (
    <div className="relative py-4">
      <Image key={url} width={width} src={url} crossOrigin="anonymous" />
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
