import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import { useContext } from 'react'

export function BuiltForCard({
  card,
  heading,
  subheading,
}: {
  card: 'daos' | 'crowdfunding' | 'nfts' | 'builders'
  heading: string | JSX.Element
  subheading: string | JSX.Element
}) {
  const { forThemeOption } = useContext(ThemeContext)

  const imageSrc = `/assets/images/home/why-juicebox/why-jb-${card}.png`
  const imageWidth = 180

  let blobSrc = ''

  if (forThemeOption) {
    blobSrc = forThemeOption({
      light: `/assets/images/home/why-juicebox/blobs-light/blob-${card}.png`,
      dark: `/assets/images/home/why-juicebox/blobs-dark/blob-${card}.png`,
    })
  }

  if (!blobSrc.length) return null

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-[${imageWidth}px] h-[${imageWidth}px]`}>
        <div className="absolute inset-0">
          <Image
            src={blobSrc}
            alt={`${card}-blob`}
            width={imageWidth}
            height={imageWidth}
            className="object-fit object-center"
          />
        </div>
        <div className="absolute inset-0">
          <Image
            src={imageSrc ?? ''}
            alt={card}
            width={imageWidth}
            height={imageWidth}
            className="object-cover object-center"
          />
        </div>
      </div>
      <h3 className="text-primary mt-10 whitespace-nowrap text-center text-2xl">
        {heading}
      </h3>
      <p className="text-center text-base text-grey-700 dark:text-slate-200">
        {subheading}
      </p>
    </div>
  )
}
