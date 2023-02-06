import { PlaySquareOutlined } from '@ant-design/icons'
import { twJoin } from 'tailwind-merge'

export function JuiceVideoThumbnail({
  src,
  isSelected,
}: {
  src: string
  isSelected?: boolean
}) {
  return (
    <>
      <div className="absolute top-0 h-full w-full">
        <div className="absolute inset-0">
          <div className="flex h-full items-center justify-center">
            <PlaySquareOutlined
              className={twJoin(
                isSelected ? 'text-primary' : 'text-tertiary',
                'margin-auto z-10 w-full text-5xl',
              )}
            />
          </div>
        </div>
        <video
          muted
          className="absolute inset-0 h-full w-full"
          style={{
            filter: isSelected ? 'unset' : 'brightness(50%)',
          }}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  )
}
