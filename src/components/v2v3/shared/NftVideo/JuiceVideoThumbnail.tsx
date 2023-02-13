import { LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { JuicePlayIcon } from './JuicePlayIcon'

export function JuiceVideoThumbnail({
  src,
  isSelected,
}: {
  src: string
  isSelected?: boolean
}) {
  const [loading, setLoading] = useState<boolean>(true)
  return (
    <>
      <div className="absolute top-0 h-full w-full">
        <div className="absolute bottom-[8px] right-2 z-[1]">
          <JuicePlayIcon />
        </div>
        {loading ? (
          <div
            className={`flex h-full w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600`}
          >
            <LoadingOutlined />
          </div>
        ) : null}
        <video
          muted
          className="absolute inset-0 h-full w-full"
          style={{
            filter: isSelected ? 'unset' : 'brightness(50%)',
          }}
          onLoadedData={() => setLoading(false)}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  )
}
