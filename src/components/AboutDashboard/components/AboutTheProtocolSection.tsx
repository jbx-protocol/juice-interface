import { GithubFilled } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { TickIconListItem } from 'components/TickIconListItem'
import Image from 'next/image'
import { SectionContainer } from './SectionContainer'
import illustration from '/public/assets/images/about/illustration2.webp'

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

        <ul className="mb-8 flex flex-col md:ml-4">
          {[t`Open source`, t`Community-owned`, t`100% transparent`].map(
            item => (
              <TickIconListItem text={item} key={item} />
            ),
          )}
        </ul>

        <ExternalLink
          className="block w-min"
          href="https://github.com/jbx-protocol/juice-interface"
        >
          <Button
            className="flex items-center gap-2 leading-none text-white"
            type="primary"
            size="large"
            icon={<GithubFilled />}
          >
            <Trans>See the code</Trans>
          </Button>
        </ExternalLink>
      </div>

      <div className="mx-auto mt-14 w-full max-w-sm md:order-1 md:mx-0 md:mt-0">
        <Image
          src={illustration}
          alt="Strawberry mixin' some juicy ethereum juice"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </SectionContainer>
  )
}
