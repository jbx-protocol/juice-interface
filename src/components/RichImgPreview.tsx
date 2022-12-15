import { t } from '@lingui/macro'
import { Image } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { CSSProperties } from 'react'
import { twMerge } from 'tailwind-merge'

export default function RichImgPreview({
  className,
  src,
}: {
  className?: string
  src: string | undefined
  maxWidth?: CSSProperties['maxWidth']
  maxHeight?: CSSProperties['maxHeight']
}) {
  const contentType = useContentType(src)

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
        src={src}
        alt={t`Payment memo image`}
        loading="lazy"
        crossOrigin="anonymous"
      />
    )
  }

  return null
}
