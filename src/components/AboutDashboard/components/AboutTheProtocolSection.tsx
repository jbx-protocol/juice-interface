import { GithubFilled } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { TickIconListItem } from 'components/TickIconListItem'
import Image from 'next/image'
import { AboutButton } from './Button'
import { SectionContainer } from './SectionContainer'

export const AboutTheProtocolSection = () => {
  return (
    <SectionContainer className="md:flex md:items-center md:justify-between md:text-start">
      <div className="md:order-2 md:w-1/2">
        <h2 className="text-3xl md:text-4xl">
          <Trans>About the protocol</Trans>
        </h2>
        <p className="text-base text-grey-700 dark:text-slate-200 md:text-lg">
          <Trans>
            Juicebox is an open-source protocol that is transparent,
            community-owned, and built on the Ethereum blockchain.
          </Trans>
        </p>

        <ul className="flex flex-col font-medium md:ml-4">
          {[t`Open source`, t`Community-owned`, t`100% transparent`].map(
            item => (
              <TickIconListItem text={item} key={item} />
            ),
          )}
        </ul>

        <ExternalLink href="https://github.com/jbx-protocol/juice-interface">
          <AboutButton className="flex items-center gap-2">
            <GithubFilled />
            <Trans>Fork the Repo</Trans>
          </AboutButton>
        </ExternalLink>
      </div>

      <div className="mx-auto mt-14 w-full max-w-sm md:order-1 md:mx-0 md:mt-0">
        <Image
          src={'/assets/images/about/illustration2.png'}
          alt="Strawberry mixin' some juicy ethereum juice"
          width={380}
          height={380}
        />
      </div>
    </SectionContainer>
  )
}
