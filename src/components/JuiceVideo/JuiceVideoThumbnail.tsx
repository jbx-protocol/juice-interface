import { useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { JuicePlayIcon } from './JuicePlayIcon'

export type PlayIconPosition = 'hidden' | 'default' | 'center'

export function JuiceVideoThumbnail({
  className,
  videoClassName,
  src,
  playIconPosition = 'default',
  onLoaded,
  onClick,
}: {
  className?: string
  videoClassName?: string
  src: string
  playIconPosition?: PlayIconPosition
  onLoaded?: VoidFunction
  onClick?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>(true)

  const playIconContainerClassName = 'bottom-3 right-2'
  return (
    <div
      className={twMerge('relative top-0 h-full w-full', className)}
      onClick={onClick}
    >
      {!loading && playIconPosition !== 'hidden' ? (
        <div className={`absolute z-[1] ${playIconContainerClassName}`}>
          <JuicePlayIcon />
        </div>
      ) : null}
      <video
        muted
        className={twMerge('h-full w-full', videoClassName)}
        onLoadedData={() => {
          setLoading(false)
          onLoaded?.()
        }}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
