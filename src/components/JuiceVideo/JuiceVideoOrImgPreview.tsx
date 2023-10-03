import { CloseOutlined } from '@ant-design/icons'
import { JuiceVideoPreview } from 'components/JuiceVideo/JuiceVideoPreview'
import { useContentType } from 'hooks/useContentType'
import { ImageProps } from 'next/image'
import { stopPropagation } from 'react-stop-propagation'
import { fileTypeIsVideo } from 'utils/nftRewards'

const JUICE_IMG_PREVIEW_CONTAINER_CLASS =
  'fixed top-0 left-0 z-[10000] flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.8)] p-5 cursor-default'

export function JuiceVideoOrImgPreview({
  src,
  alt,
  visible,
  onClose,
  ...props
}: ImageProps & {
  src: string
  visible: boolean
  onClose: VoidFunction
}) {
  if (!visible || !src) return null

  const { data: contentType } = useContentType(src)
  const isVideo = fileTypeIsVideo(contentType)

  const _onClose = stopPropagation(onClose)

  return (
    <div className={JUICE_IMG_PREVIEW_CONTAINER_CLASS} onClick={_onClose}>
      <CloseOutlined
        className="absolute top-10 right-10 pl-4 text-2xl text-slate-100"
        onClick={_onClose}
      />
      <div className="text-center">
        {isVideo ? (
          <JuiceVideoPreview src={src} />
        ) : (
          <img
            className="max-h-[50vh] md:max-h-[60vh]"
            alt={alt}
            src={src}
            onClick={e => e.stopPropagation()}
            crossOrigin="anonymous"
            {...props}
          />
        )}
      </div>
    </div>
  )
}
