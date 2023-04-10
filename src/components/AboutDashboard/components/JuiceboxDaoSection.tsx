import { CheckIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import Image from 'next/image'
import { SectionContainer } from './SectionContainer'
import juiceHero from '/public/assets/juice-homepage-hero.webp'

export const JuiceboxDaoSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:text-start">
      <div className="md:w-1/2">
        <h2 className="font-header text-4xl">Juicebox DAO</h2>
        <p>
          <Trans>
            Juicebox is an open-source protocol that is transparent,
            community-owned, and built on the Ethereum blockchain.
          </Trans>
        </p>

        <div className="my-8 ml-4 flex flex-col gap-3 md:gap-5">
          {[t`Submit a proposal`, t`View the treasury`, t`Something else`].map(
            item => (
              <div className="flex items-center gap-3" key={item}>
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-split-100 text-split-600 dark:bg-split-600 dark:text-split-100">
                  <CheckIcon className="h-3.5 w-3.5" />
                </div>
                {item}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto w-80 max-w-xs md:mx-0">
        <Image
          src={juiceHero}
          alt="Banny the chill Juicebox banana drinking juice"
          priority
        />
      </div>
    </SectionContainer>
  )
}
