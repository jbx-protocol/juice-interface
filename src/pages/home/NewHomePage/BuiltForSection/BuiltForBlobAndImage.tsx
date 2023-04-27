import { ThemeContext } from 'contexts/Theme/ThemeContext'
import useMobile from 'hooks/Mobile'
import Image from 'next/image'
import { useContext } from 'react'

export function BuiltForBlobAndImage({
  card,
}: // imageTranslateY,
{
  card: 'daos' | 'crowdfunding' | 'nfts' | 'builders'
  imageTranslateY?: number
}) {
  const { forThemeOption } = useContext(ThemeContext)

  const isMobile = useMobile()

  const imageSrc = `/assets/images/home/why-juicebox/why-jb-${card}.png`

  const blobSrc = forThemeOption?.({
    light: `/assets/images/home/why-juicebox/blobs-light/blob-${card}.png`,
    dark: `/assets/images/home/why-juicebox/blobs-dark/blob-${card}.png`,
  })

  // Parallax style
  const transformStyle = {
    // TODO re-enable the below line when 'return to homepage' bug is fixed
    // transform: `translateY(calc(-50% + ${imageTranslateY}px))`,
    transformOrigin: 'center',
  }

  return (
    <div className="relative h-[180px] w-[180px]">
      <div className="absolute inset-5">
        {blobSrc ? (
          <Image
            src={blobSrc}
            alt={`${card}-blob`}
            width={144}
            height={144}
            className="object-fit object-center"
          />
        ) : null}
      </div>
      <div style={!isMobile ? transformStyle : undefined}>
        <Image
          src={imageSrc ?? ''}
          alt={card}
          width={180}
          height={180}
          className="object-cover object-center"
        />
      </div>
    </div>
  )
}
