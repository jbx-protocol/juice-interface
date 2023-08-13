import {
  ArrowTrendingUpIcon,
  BoltIcon,
  CubeTransparentIcon,
  ShieldCheckIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { WhyJuiceboxCard } from 'components/Home/WhyJuiceboxSection/WhyJuiceboxCard'

export function WhyJuiceboxSection() {
  return (
    <SectionContainer>
      <SectionHeading
        heading={t`Why Juicebox?`}
        subheading={
          <Trans>
            Open a full-featured Ethereum treasury with programmable spending in
            minutes.
          </Trans>
        }
      />

      <div
        className="mx-auto flex max-w-5xl flex-wrap justify-center gap-8"
        style={{ perspective: 1000 }}
      >
        <WhyJuiceboxCard
          className="bg-melon-400 dark:bg-melon-500"
          iconWrapperClassName="bg-melon-200 dark:bg-melon-800"
          icon={
            <UserGroupIcon className="h-8 w-8 text-melon-700 dark:text-melon-400" />
          }
          heading={t`Community owned`}
          content={
            <Trans>
              Juicebox is owned and governed by the people — its builders,
              supporters, and project creators using the protocol.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          className="bg-peel-400"
          iconWrapperClassName="bg-peel-100 dark:bg-peel-800"
          icon={
            <BoltIcon className="h-8 w-8 text-peel-500 dark:text-peel-400" />
          }
          heading={t`Battle tested`}
          content={
            <Trans>
              Juicebox is reliable, open-source, audited, and has been
              battle-tested by more than 1,000 projects raising over 50,000 ETH.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          className="bg-grape-400"
          iconWrapperClassName="bg-grape-200 dark:bg-grape-800"
          icon={
            <ShieldCheckIcon className="h-8 w-8 text-grape-600 dark:text-grape-400" />
          }
          heading={t`Trust minimized`}
          content={
            <Trans>
              Juicebox is non-custodial, meaning you have complete ownership
              over your project and its funds. Easily customize your own
              on-chain rules.
            </Trans>
          }
        />

        <WhyJuiceboxCard
          className="bg-crush-400 dark:bg-crush-400"
          iconWrapperClassName="bg-crush-200 dark:bg-crush-800"
          icon={
            <ArrowTrendingUpIcon className="h-8 w-8 text-crush-700 dark:text-crush-400" />
          }
          heading={t`Flexible`}
          content={
            <Trans>
              Whether you're building a boutique crypto law firm or the next
              mega-fundraiser, Juicebox is customizable to match your needs.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          className="bg-split-400"
          iconWrapperClassName="bg-split-200 dark:bg-split-800"
          icon={
            <CubeTransparentIcon className="h-8 w-8 text-split-700 dark:text-split-400" />
          }
          heading={t`Extensible`}
          content={
            <Trans>
              Safe, Snapshot, or even on-chain governance: Juicebox uses simple
              standards and works with all of your favorite Ethereum tools.
            </Trans>
          }
        />
      </div>
    </SectionContainer>
  )
}
