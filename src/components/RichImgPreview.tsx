import { t } from '@lingui/macro'
import { Image, ImageProps } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { CSSProperties, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { JuiceImgPreview } from './Create/components/JuiceImgPreview'

export default function RichImgPreview({
  className,
  src,
}: {
  className?: string
  src: string
  maxWidth?: CSSProperties['maxWidth']
  maxHeight?: CSSProperties['maxHeight']
}) {
  const { data: contentType } = useContentType(src)
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)

  if (
    contentType === 'image/jpeg' ||
    contentType === 'image/jpg' ||
    contentType === 'image/gif' ||
    contentType === 'image/png' ||
    contentType === 'image/svg'
  ) {
    const alt = t`Payment memo image`
    const imageProps: ImageProps = {
      src,
      alt,
      loading: 'lazy',
      crossOrigin: 'anonymous',
    }
    return (
      <>
        <Image
          className={twMerge(
            'h-24 w-24 cursor-pointer hover:brightness-50',
            className,
          )}
          onClick={() => setPreviewVisible(true)}
          preview={false}
          {...imageProps}
        />
        <JuiceImgPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          {...imageProps}
        />
      </>
    )
  }

  return null
}
