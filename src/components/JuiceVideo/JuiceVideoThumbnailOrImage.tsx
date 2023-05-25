import { LoadingOutlined } from '@ant-design/icons'
import { useContentType } from 'hooks/useContentType'
import { ImageProps } from 'next/image'
import { useState } from 'react'
import { stopPropagation } from 'react-stop-propagation'
import { classNames } from 'utils/classNames'
import { fileTypeIsVideo } from 'utils/nftRewards'
import { JuiceVideoOrImgPreview } from './JuiceVideoOrImgPreview'
import { JuiceVideoThumbnail, PlayIconPosition } from './JuiceVideoThumbnail'

export function JuiceVideoThumbnailOrImage({
  playIconPosition,
  heightClass,
  widthClass,
  showPreviewOnClick,
  ...props
}: ImageProps & {
  playIconPosition?: PlayIconPosition
  heightClass?: string
  widthClass?: string
  src: string
  alt?: string
  showPreviewOnClick?: boolean
}) {
  const [loading, setLoading] = useState<boolean>(true)
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  const { data: contentType } = useContentType(props.src)
  const isVideo = fileTypeIsVideo(contentType)
  const _className = classNames(
    widthClass ?? 'w-full',
    heightClass ?? 'h-full',
    showPreviewOnClick ? 'cursor-pointer' : '',
    'rounded-lg overflow-hidden',
  )

  return (
    <div className={_className}>
      {loading ? (
        <div
          className={`flex items-center justify-center border border-smoke-200 dark:border-grey-600 ${widthClass} ${heightClass}`}
        >
          <LoadingOutlined className="text-primary" />
        </div>
      ) : null}
      <div
        onClick={
          showPreviewOnClick
            ? stopPropagation(() => setPreviewVisible(true))
            : undefined
        }
        className="h-full w-full"
      >
        {isVideo ? (
          <JuiceVideoThumbnail
            src={props.src}
            className={props.className}
            widthClass={widthClass}
            heightClass={heightClass}
            onLoaded={() => setLoading(false)}
            playIconPosition={playIconPosition}
          />
        ) : (
          <img
            className={`${
              props.className ?? ''
            } top-0 h-full w-full object-cover`}
            src={props.src}
            onClick={props.onClick}
            crossOrigin="anonymous"
            onLoad={() => setLoading(false)}
            alt="Enlarged media preview"
          />
        )}
      </div>
      <JuiceVideoOrImgPreview
        alt="NFT media"
        visible={previewVisible}
        src={props.src}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  )
}
