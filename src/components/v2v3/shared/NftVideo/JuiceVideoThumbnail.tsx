import { JuicePlayIcon } from './JuicePlayIcon'

export type PlayIconPosition = 'hidden' | 'default' | 'center'

export function JuiceVideoThumbnail({
  src,
  isSelected,
  widthClass,
  heightClass,
  playIconPosition = 'default',
  className = '',
  onLoaded,
}: {
  src: string
  isSelected?: boolean
  widthClass?: string | number // rem width
  heightClass?: string | number // rem height
  playIconPosition?: PlayIconPosition
  className?: string
  onLoaded?: VoidFunction
}) {
  const _width = widthClass ?? 'w-full'
  const _height = heightClass ?? 'h-full'

  const playIconContainerClassName = 'bottom-3 right-2'
  return (
    <div className={`${className} relative top-0 ${_width} ${_height}`}>
      {playIconPosition !== 'hidden' ? (
        <div className={`absolute z-[1] ${playIconContainerClassName}`}>
          <JuicePlayIcon />
        </div>
      ) : null}
      <video
        muted
        className={`h-full w-full`}
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
