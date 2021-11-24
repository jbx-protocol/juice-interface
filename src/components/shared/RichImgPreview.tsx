import { Image } from 'antd'
import { useContentType } from 'hooks/ContentType'
import { CSSProperties } from 'react'

export default function RichImgPreview({
  src,
  width,
  height,
  style,
}: {
  src: string | undefined
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  style?: CSSProperties
}) {
  const contentType = useContentType(src)

  const w = width ?? 100
  const h = height ?? 100

  if (
    contentType === 'image/jpeg' ||
    contentType === 'image/jpg' ||
    contentType === 'image/gif' ||
    contentType === 'image/png' ||
    contentType === 'image/svg'
  ) {
    return (
      <Image
        src={src}
        style={{
          maxWidth: w,
          maxHeight: h,
          width: w,
          height: h,
          ...style,
        }}
      />
    )
  }

  return null
}
