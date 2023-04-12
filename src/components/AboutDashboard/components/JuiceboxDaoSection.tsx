import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Image from 'next/image'
import { AboutButton } from './Button'
import { SectionContainer } from './SectionContainer'
import juiceHero from '/public/assets/juice-homepage-hero.webp'

export const JuiceboxDaoSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:text-start">
      <div className="md:w-1/2">
        <h2 className="font-header text-3xl md:text-4xl">Juicebox DAO</h2>
        <p className="text-base text-grey-700 dark:text-slate-200 md:text-lg">
          <Trans>
            Juicebox is an open-source protocol that is transparent,
            community-owned, and built on the Ethereum blockchain.
          </Trans>
        </p>

        <ExternalLink href="https://discord.gg/wFTh4QnDzk">
          <AboutButton>
            <Trans>Join our Discord</Trans>
          </AboutButton>
        </ExternalLink>
      </div>

      <div className="mx-auto mt-14 w-80 max-w-xs md:mx-0">
        <Image
          src={juiceHero}
          alt="Banny the chill Juicebox banana drinking juice"
          priority
        />
      </div>
    </SectionContainer>
  )
}
