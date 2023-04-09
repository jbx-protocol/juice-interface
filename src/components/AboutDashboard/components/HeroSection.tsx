import { Trans } from '@lingui/macro'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { SectionContainer } from './SectionContainer'
import juiceHero from '/public/assets/juice-homepage-hero.webp'

export const HeroSection = () => {
  return (
    <SectionContainer className="flex flex-col gap-5">
      <div className="mx-auto w-80">
        <Image
          src={juiceHero}
          alt="Banny the chill Juicebox banana drinking juice"
          priority
        />
      </div>
      <div className={twMerge('text-action-primary text-lg', 'md:text-xl')}>
        <Trans>We are Juicebox</Trans>
      </div>
      <h1
        className={twMerge(
          'text-primary font-heading text-2xl font-bold',
          'md:text-5xl',
        )}
      >
        <Trans>
          Enabling the creators of tomorrow to launch, fund and manage the
          boldest projects on the internet.
        </Trans>
      </h1>
    </SectionContainer>
  )
}
