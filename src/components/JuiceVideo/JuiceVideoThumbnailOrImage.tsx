import { JuiceVideoThumbnail, PlayIconPosition } from './JuiceVideoThumbnail'
import { useCallback, useState } from 'react'

import { ImageProps } from "next/legacy/image"
import { JuiceVideoOrImgPreview } from './JuiceVideoOrImgPreview'
import { LoadingOutlined } from '@ant-design/icons'
import { fileTypeIsVideo } from 'utils/nftRewards'
import { twMerge } from 'tailwind-merge'
import { useContentType } from 'hooks/useContentType'

type JuiceVideoThumbnailOrImageProps = {
  playIconPosition?: PlayIconPosition
  src: string
  alt?: string
  showPreviewOnClick?: boolean
}

export function JuiceVideoThumbnailOrImage({
  playIconPosition,
  showPreviewOnClick,
  ...props
}: Omit<ImageProps, 'onClick'> & JuiceVideoThumbnailOrImageProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  const { data: contentType } = useContentType(props.src)
  const isVideo = fileTypeIsVideo(contentType)

  const handleClick = useCallback(() => {
    if (showPreviewOnClick) {
      setPreviewVisible(true)
    }
  }, [showPreviewOnClick])

  return (
    <>
      {loading && (
        <div
          className={twMerge(
            `flex items-center justify-center border border-smoke-200 dark:border-grey-600`,
            props.className,
          )}
        >
          <LoadingOutlined className="text-primary" />
        </div>
      )}
      {isVideo ? (
        <JuiceVideoThumbnail
          src={props.src}
          className={twMerge(
            'overflow-hidden rounded-lg',
            showPreviewOnClick ? 'cursor-pointer' : '',
            loading && 'hidden',
            props.className,
          )}
          onLoaded={() => setLoading(false)}
          playIconPosition={playIconPosition}
          onClick={handleClick}
        />
      ) : (
        <img
          className={twMerge(
            loading && 'hidden',
            'overflow-hidden rounded-lg',
            'top-0 h-full w-full object-cover',
            showPreviewOnClick ? 'cursor-pointer' : '',
            props.className,
          )}
          src={props.src}
          onClick={handleClick}
          crossOrigin="anonymous"
          onLoad={() => setLoading(false)}
          alt="Enlarged media preview"
        />
      )}
      <JuiceVideoOrImgPreview
        alt="NFT media"
        visible={previewVisible}
        src={props.src}
        onClose={() => setPreviewVisible(false)}
      />
    </>
  )
}
