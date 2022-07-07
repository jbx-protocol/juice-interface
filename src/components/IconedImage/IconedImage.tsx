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
    <div style={{ position: 'relative', padding: '1rem 0' }}>
      <Image key={url} width={width} src={url} />
      <div
        role="button"
        style={{
          cursor: 'pointer',
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        onClick={onClick}
      >
        {icon}
      </div>
    </div>
  )
}
