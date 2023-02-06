import { PlayCircleFilled, LoadingOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { twJoin } from 'tailwind-merge'

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
        <div className="absolute bottom-0 right-2 z-10">
          <PlayCircleFilled
            className={twJoin(
              isSelected ? 'text-primary' : 'text-tertiary',
              'margin-auto w-full text-6xl sm:text-4xl ',
            )}
          />
        </div>
        {loading ? (
          <div
            className={`flex h-[144px] w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600`}
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
          preload="none"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </>
  )
}
