import { Trans } from '@lingui/macro'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { SectionContainer } from './SectionContainer'
import illustration from '/public/assets/images/about/hero.webp'

export const HeroSection = () => {
  return (
    <SectionContainer className="flex flex-col gap-5 text-center md:text-5xl">
      <div className="mx-auto w-full max-w-3xl">
        <Image
          src={illustration}
          alt="Banny and lil' Blueberry chillin out next to the juicebox and a hamper of fruit"
          priority
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
      <h1
        className={twMerge(
          'text-primary mx-auto max-w-4xl text-2xl font-bold',
          'md:text-5xl',
        )}
      >
        <Trans>
          Juicebox enables the creators of tomorrow to launch, fund and manage
          the boldest projects on the internet.
        </Trans>
      </h1>
    </SectionContainer>
  )
}
