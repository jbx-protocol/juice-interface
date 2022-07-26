import { useEffect, useState } from 'react'
import { Image, ImageProps } from 'antd'

interface FallbackImageProps {
  src: string | undefined
  fallbackSrc: string | undefined
  rest: ImageProps
}

const FallbackImage = ({ src, fallbackSrc, rest }: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])

  return (
    <Image
      {...rest}
      src={imgSrc ? imgSrc : ''}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}

export default FallbackImage
