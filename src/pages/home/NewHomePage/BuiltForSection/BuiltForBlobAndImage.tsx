import { ThemeContext } from 'contexts/Theme/ThemeContext'
import useMobile from 'hooks/Mobile'
import debounce from 'lodash/debounce'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'

// ***CAUTION*** If anything change above the blob/image, this needs to be updated
const Y_OFFSET_CONSTANT = 650

export function BuiltForBlobAndImage({
  card,
}: {
  card: 'daos' | 'crowdfunding' | 'nfts' | 'builders'
}) {
  const { forThemeOption } = useContext(ThemeContext)
  const isMobile = useMobile()

  const [scrollPosition, setScrollPosition] = useState(0)

  // Handle parallax effect on scroll
  useEffect(() => {
    const handleScroll = debounce(() => {
      setScrollPosition(window.pageYOffset + Y_OFFSET_CONSTANT)
    }, 10)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const imageSrc = `/assets/images/home/why-juicebox/why-jb-${card}.png`

  let blobSrc = ''

  if (forThemeOption) {
    blobSrc = forThemeOption({
      light: `/assets/images/home/why-juicebox/blobs-light/blob-${card}.png`,
      dark: `/assets/images/home/why-juicebox/blobs-dark/blob-${card}.png`,
    })
  }

  if (!blobSrc.length) return null

  // Parallax style
  const transformStyle = {
    transform: `translate(0%, calc(-50% + ${scrollPosition * 0.05}px))`,
    transformOrigin: `center`,
  }

  return (
    <div className={`relative h-[180px] w-[180px]`}>
      <div className="absolute inset-5">
        <Image
          src={blobSrc}
          alt={`${card}-blob`}
          width={144}
          height={144}
          className="object-fit object-center"
        />
      </div>
      <div className="absolute inset-0" style={!isMobile ? transformStyle : {}}>
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
