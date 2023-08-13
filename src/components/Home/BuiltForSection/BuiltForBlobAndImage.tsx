import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import { useContext } from 'react'
import buildersImage from '/public/assets/images/home/why-juicebox/builders.webp'
import crowdfundingImage from '/public/assets/images/home/why-juicebox/crowdfunding.webp'
import daosImage from '/public/assets/images/home/why-juicebox/daos.webp'
import nftsImage from '/public/assets/images/home/why-juicebox/nfts.webp'

type CardType = 'daos' | 'crowdfunding' | 'nfts' | 'builders'

const images = {
  daos: daosImage,
  crowdfunding: crowdfundingImage,
  nfts: nftsImage,
  builders: buildersImage,
}

export function BuiltForBlobAndImage({
  card,
}: // imageTranslateY,
{
  card: CardType
  imageTranslateY?: number
}) {
  const { forThemeOption } = useContext(ThemeContext)

  const blobSrc = forThemeOption?.({
    light: `/assets/images/home/why-juicebox/blobs-light/blob-${card}.png`,
    dark: `/assets/images/home/why-juicebox/blobs-dark/blob-${card}.png`,
  })

  return (
    <div className="relative h-[180px] w-[180px]">
      <div className="absolute inset-5">
        {blobSrc ? (
          <Image
            src={blobSrc}
            alt={`${card}-blob`}
            width={144}
            height={144}
            style={{
              maxWidth: '100%',
              height: 'auto',
            }}
          />
        ) : null}
      </div>
      <div>
        <Image
          src={images[card]}
          alt={card}
          style={{
            maxWidth: '100%',
            height: 'auto',
            position: 'relative',
          }}
        />
      </div>
    </div>
  )
}
