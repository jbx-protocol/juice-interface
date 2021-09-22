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

  if (
    contentType === 'image/jpeg' ||
    contentType === 'image/jpg' ||
    contentType === 'image/gif' ||
    contentType === 'image/png' ||
    contentType === 'image/svg'
  ) {
    return (
      <img
        src={src}
        style={{
          maxWidth: width ?? 100,
          maxHeight: height ?? 100,
          ...style,
        }}
      />
    )
  }

  return null
}
