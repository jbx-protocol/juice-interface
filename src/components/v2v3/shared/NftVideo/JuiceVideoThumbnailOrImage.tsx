import { LoadingOutlined } from '@ant-design/icons'
import { ImageProps } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { useState } from 'react'
import { classNames } from 'utils/classNames'
import { MP4_FILE_TYPE } from '../FundingCycleConfigurationDrawers/NftDrawer/NftUpload'
import { JuiceVideoThumbnail, PlayIconPosition } from './JuiceVideoThumbnail'

export function JuiceVideoThumbnailOrImage({
  isSelected,
  playIconPosition,
  ...props
}: ImageProps & {
  isSelected?: boolean
  playIconPosition?: PlayIconPosition
  src: string
}) {
  const [loading, setLoading] = useState<boolean>(true)

  const { data: contentType } = useContentType(props.src)
  const isVideo = contentType === MP4_FILE_TYPE
  const className = classNames(
    props.width ? `w-[${props.width}]` : 'w-full',
    props.height ? `h-[${props.height}]` : 'h-full',
  )

  return (
    <div className={className}>
      {loading ? (
        <div className="flex h-full w-full items-center justify-center border border-solid border-smoke-200 dark:border-grey-600">
          <LoadingOutlined />
        </div>
      ) : null}
      {isVideo ? (
        <JuiceVideoThumbnail
          src={props.src}
          isSelected={isSelected}
          className={props.className}
          onLoaded={() => setLoading(false)}
          playIconPosition={playIconPosition}
        />
      ) : (
        <img
          className={`${
            props.className ?? ''
          } top-0 h-full w-full object-cover`}
          style={{
            filter: isSelected ? 'unset' : 'brightness(50%)',
          }}
          src={props.src}
          onClick={props.onClick}
          crossOrigin="anonymous"
          onLoad={() => setLoading(false)}
        />
      )}
    </div>
  )
}
