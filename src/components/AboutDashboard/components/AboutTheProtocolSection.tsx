import { CheckIcon } from '@heroicons/react/24/solid'
import { Trans, t } from '@lingui/macro'
import Image from 'next/image'
import { SectionContainer } from './SectionContainer'

export const AboutTheProtocolSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:text-start">
      <div className="md:order-2 md:w-1/2">
        <h2 className="font-header text-3xl md:text-4xl">
          <Trans>About the protocol</Trans>
        </h2>
        <p className="text-base text-grey-700 dark:text-slate-200 md:text-lg">
          <Trans>
            Juicebox is an open-source protocol that is transparent,
            community-owned, and built on the Ethereum blockchain.
          </Trans>
        </p>

        <div className="my-8 flex flex-col gap-5 md:ml-4">
          {[t`Open source`, t`Community-owned`, t`100% transparent`].map(
            item => (
              <div className="flex items-center gap-3" key={item}>
                <CircleCheckIcon />
                {item}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto mt-14 w-full max-w-sm md:order-1 md:mx-0 md:mt-0">
        <Image
          src={'/assets/about/illustration2.svg'}
          alt="Strawberry mixin' some juicy ethereum juice"
          width={380}
          height={380}
          layout="responsive"
        />
      </div>
    </SectionContainer>
  )
}

const CircleCheckIcon = () => (
  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-bluebs-100 text-bluebs-500 dark:bg-bluebs-900 dark:text-bluebs-500">
    <CheckIcon className="h-3.5 w-3.5" />
  </div>
)
