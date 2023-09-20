import {
  CurrencyDollarIcon,
  UserGroupIcon,
  WrenchScrewdriverIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { XLButton } from 'components/buttons/XLButton'
import Image from 'next/image'
import Link from 'next/link'
import sassyBlueberry from '/public/assets/images/sassy-blueberry.webp'

const StepItem = ({
  header,
  children,
  icon,
  showDottedLine,
}: React.PropsWithChildren<{
  header: string
  icon: JSX.Element
  showDottedLine?: boolean
}>) => (
  <div className="flex gap-3">
    <div className="mb-2 w-14 flex-shrink-0">
      <div>
        <span className="box-content flex h-10 w-10 items-center justify-center rounded-full border-8 border-split-50 bg-split-100 text-split-700 dark:border-split-950 dark:bg-split-900 dark:text-split-500">
          {icon}
        </span>
      </div>
      {showDottedLine && (
        <div className="dotted-line mx-auto h-full w-0.5 text-split-200 dark:text-split-800" />
      )}
    </div>
    <div className="mt-3">
      <h3 className="m-0 text-2xl text-grey-900 dark:text-slate-100">
        {header}
      </h3>
      <p className="mb-0 mt-1 text-base text-grey-700 dark:text-slate-200">
        {children}
      </p>
    </div>
  </div>
)

export function HowJuiceboxWorksSection() {
  return (
    <SectionContainer>
      <SectionHeading
        heading={t`How Juicebox works`}
        subheading={
          <Trans>
            It's fast, powerful and easy to use. Launch your project and get
            funded in minutes.
          </Trans>
        }
      />
      <div className="my-0 mx-auto max-w-5xl">
        <div className="justify-between pb-16 lg:flex lg:items-center">
          <div className="flex max-w-xl flex-col gap-y-12">
            <StepItem
              header={t`1. Create your project`}
              icon={<WrenchScrewdriverIcon className="h-6 w-6" />}
              showDottedLine
            >
              <Trans>
                Juicebox is the best-in-class tool for crowdfunding your project
                with ETH - build your supporters' trust by transparently setting
                up payouts, token issuance, redemption, and other rules in
                advance.
              </Trans>
            </StepItem>
            <StepItem
              header={t`2. Manage your funds`}
              icon={<CurrencyDollarIcon className="h-6 w-6" />}
              showDottedLine
            >
              <Trans>
                Get paid in ETH, program your own payouts, token issuance, and
                redemptions to easily run your treasury completely on-chain — as
                your community grows, you can update your treasury's rules to
                grow with it.
              </Trans>
            </StepItem>
            <StepItem
              header={t`3. Build your community`}
              icon={<UserGroupIcon className="h-6 w-6" />}
            >
              <Trans>
                Issue tokens or NFTs to your supporters and use them for
                governance, token-gated websites, or redemptions. With flexible
                token issuance and redemption, your project automatically scales
                to meet your supporters' demand.
              </Trans>
            </StepItem>
          </div>
          <div className="mx-auto mt-20 w-full max-w-xs text-center lg:mx-24 lg:mt-0">
            <Image
              src={sassyBlueberry}
              alt="Sassy Juicebox Blueberry crossing arms"
              loading="lazy"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          </div>
        </div>

        <div className="mt-5 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          <ExternalLink href="https://docs.juicebox.money/">
            <XLButton type="default" size="large">
              <Trans>Read the docs</Trans>
            </XLButton>
          </ExternalLink>

          <Link href="/create">
            <XLButton type="primary" className="w-full md:w-auto" size="large">
              <Trans>Create a project</Trans>
            </XLButton>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
