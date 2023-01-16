import { CloseOutlined } from '@ant-design/icons'
import { Image, ImageProps } from 'antd'
import useMobile from 'hooks/Mobile'
import { classNames } from 'utils/classNames'

export const JUICE_IMG_PREVIEW_CONTAINER_CLASS =
  'fixed top-0 left-0 z-[10000] flex h-full w-full items-center justify-center overflow-auto bg-[rgba(0,0,0,0.8)]'

export function JuiceImgPreview({
  src,
  alt,
  visible,
  onClose,
  ...props
}: ImageProps & {
  visible: boolean
  onClose: VoidFunction
}) {
  const isMobile = useMobile()
  if (!visible) return null
  return (
    <div className={JUICE_IMG_PREVIEW_CONTAINER_CLASS} onClick={onClose}>
      <div className={classNames(!isMobile ? 'w-[600px]' : 'w-[90vw]')}>
        <div className={'mb-4 flex w-full items-center justify-end'}>
          <CloseOutlined className="pl-4 text-slate-100" onClick={onClose} />
        </div>
        <div className="flex justify-center">
          <Image
            className={classNames(
              !isMobile
                ? 'max-h-[60vh] max-w-[600px]'
                : 'max-h-[50vh] max-w-[90vw]',
            )}
            alt={alt}
            src={src}
            onClick={e => e.stopPropagation()}
            crossOrigin="anonymous"
            preview={false}
            {...props}
          />
        </div>
      </div>
    </div>
  )
}
