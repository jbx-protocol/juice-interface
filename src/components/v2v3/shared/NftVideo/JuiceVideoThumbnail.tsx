import { JuicePlayIcon } from './JuicePlayIcon'

export type PlayIconPosition = 'hidden' | 'default' | 'center'

export function JuiceVideoThumbnail({
  src,
  isSelected,
  width,
  height,
  playIconPosition = 'default',
  className = '',
  onLoaded,
}: {
  src: string
  isSelected?: boolean
  width?: string | number
  height?: string | number
  playIconPosition?: PlayIconPosition
  className?: string
  onLoaded?: VoidFunction
}) {
  const _width = width ? `w-[${width}]` : 'w-full'
  const _height = height ? `h-[${height}]` : 'h-full'

  const playIconContainerClassName = 'bottom-[8px] right-2'

  return (
    <div className={`${className} top-0 ${_width} ${_height}`}>
      {playIconPosition !== 'hidden' ? (
        <div className={`absolute z-[1] ${playIconContainerClassName}`}>
          <JuicePlayIcon />
        </div>
      ) : null}
      <video
        muted
        className={`inset-0 ${_width} ${_height}`}
        style={{
          filter: isSelected ? 'unset' : 'brightness(50%)',
        }}
        onLoadedData={onLoaded}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
