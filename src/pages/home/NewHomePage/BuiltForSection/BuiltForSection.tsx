import { t, Trans } from '@lingui/macro'
import debounce from 'lodash/debounce'
import { useEffect, useRef, useState } from 'react'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { BuiltForCard } from './BuiltForCard'

const PARALAX_WEIGHT = 0.05
const PARALAX_DEBOUNCE_MS = 10

export function BuiltForSection() {
  const [cardImageTranslateY, setCardImageTranslateY] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  // Handle parallax effect on scroll
  useEffect(() => {
    const containerTop = containerRef?.current?.getBoundingClientRect()?.top
    if (!containerTop) return

    const handleScroll = debounce(() => {
      const newCardImageTranslateY =
        (window.scrollY + containerTop * 2) * PARALAX_WEIGHT
      setCardImageTranslateY(newCardImageTranslateY)
    }, PARALAX_DEBOUNCE_MS)

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Built for ideas like yours</Trans>}
        subheading={
          <Trans>
            Juicebox is as versatile as you are, build anything from an NFT
            project to a boutique crypto lawfirm and everything in between.
          </Trans>
        }
      />
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        ref={containerRef}
      >
        <BuiltForCard
          card="daos"
          heading={t`DAOs`}
          imageTranslateY={cardImageTranslateY}
          subheading={
            <Trans>
              Launch a Decentralized Autonomous Organisation with governance in
              minutes.
            </Trans>
          }
        />
        <BuiltForCard
          card="crowdfunding"
          heading={t`Crowdfunding`}
          imageTranslateY={cardImageTranslateY}
          subheading={
            <Trans>
              All-in-one crowdfunding with powerful treasury management and
              redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          card="nfts"
          heading={t`NFT Projects`}
          imageTranslateY={cardImageTranslateY}
          subheading={
            <Trans>
              Build and launch your NFT project right here on Juicebox with
              built-in redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          card="builders"
          heading={t`Creators & builders`}
          imageTranslateY={cardImageTranslateY}
          subheading={
            <Trans>
              Whatever you're building or creating — get it launched and funded
              on Juicebox.
            </Trans>
          }
        />
      </div>
    </SectionContainer>
  )
}
