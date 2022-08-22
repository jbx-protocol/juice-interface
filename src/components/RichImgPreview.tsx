import { t } from '@lingui/macro'
import { Image } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { CSSProperties } from 'react'

export default function RichImgPreview({
  src,
  width,
  height,
  maxWidth,
  maxHeight,
  style,
}: {
  src: string | undefined
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  maxWidth?: CSSProperties['maxWidth']
  maxHeight?: CSSProperties['maxHeight']
  style?: CSSProperties
}) {
  const contentType = useContentType(src)

  const w = width ?? 100
  const h = height ?? 100
  const maxW = maxWidth ?? 'auto'
  const maxH = maxHeight ?? 'auto'

  if (
    contentType === 'image/jpeg' ||
    contentType === 'image/jpg' ||
    contentType === 'image/gif' ||
    contentType === 'image/png' ||
    contentType === 'image/svg'
  ) {
    return (
      <div style={style}>
        <Image
          src={src}
          style={{
            maxWidth: maxW,
            maxHeight: maxH,
            width: w,
            height: h,
          }}
          placeholder={true}
          alt={t`Payment memo image`}
        />
      </div>
    )
  }

  return null
}
