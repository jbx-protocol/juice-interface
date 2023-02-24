import { useState } from 'react'
import { JuicePlayIcon } from './JuicePlayIcon'

export type PlayIconPosition = 'hidden' | 'default' | 'center'

export function JuiceVideoThumbnail({
  src,
  darkened,
  widthClass,
  heightClass,
  playIconPosition = 'default',
  className = '',
  onLoaded,
}: {
  src: string
  darkened?: boolean
  widthClass?: string | number // rem width
  heightClass?: string | number // rem height
  playIconPosition?: PlayIconPosition
  className?: string
  onLoaded?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>(true)
  const _width = widthClass ?? 'w-full'
  const _height = heightClass ?? 'h-full'

  const playIconContainerClassName = 'bottom-3 right-2'
  return (
    <div className={`relative top-0 ${_width} ${_height}`}>
      {!loading && playIconPosition !== 'hidden' ? (
        <div className={`absolute z-[1] ${playIconContainerClassName}`}>
          <JuicePlayIcon />
        </div>
      ) : null}
      <video
        muted
        className={`h-full w-full ${className}`}
        style={{
          filter: darkened ? 'brightness(50%)' : 'unset',
        }}
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
