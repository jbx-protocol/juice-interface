import { t } from '@lingui/macro'
import { Image } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

export default function RichImgPreview({
  className,
  src,
  size = 'default',
}: {
  className?: string
  src: string | undefined
  maxWidth?: CSSProperties['maxWidth']
  maxHeight?: CSSProperties['maxHeight']
  size: 'default' | 'thumbnail' | 'large'
}) {
  const contentType = useContentType(src)

  const imgSize = {
    default: '256',
    large: '800',
    thumbnail: '65',
  }

  if (
    contentType === 'image/jpeg' ||
    contentType === 'image/jpg' ||
    contentType === 'image/gif' ||
    contentType === 'image/png' ||
    contentType === 'image/svg'
  ) {
    return (
      <Image
        className={twMerge('h-24 w-24', className)}
        placeholder={
          <Image
            preview={false}
            src={`${src}?img-width=${imgSize['thumbnail']}&img-height=${imgSize['thumbnail']}`}
            width={65}
          />
        }
        src={`${src}?img-width=${imgSize[size]}&img-height=${imgSize[size]}`}
        alt={t`Payment memo image`}
        loading="lazy"
        crossOrigin="anonymous"
      />
    )
  }

  return null
}
