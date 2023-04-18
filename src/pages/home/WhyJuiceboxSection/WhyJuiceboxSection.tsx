import { UserGroupIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { BoltIcon } from 'components/icons/BoltIcon'
import { FlexibleIcon } from 'components/icons/FlexibleIcon'
import { TrustIcon } from 'components/icons/TrustIcon'
import { VectorsIcon } from 'components/icons/VectorsIcon'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { WhyJuiceboxCard } from './WhyJuiceboxCard'

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

      <div className="flex flex-wrap justify-center gap-8">
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
          icon={<BoltIcon />}
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
          icon={<TrustIcon />}
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
          icon={<FlexibleIcon />}
          heading={t`Flexible`}
          content={
            <Trans>
              Whether you’re building a boutique crypto law firm or the next
              mega-fundraiser, Juicebox is customizable to match your needs.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          className="bg-split-400"
          iconWrapperClassName="bg-split-200 dark:bg-split-800"
          icon={<VectorsIcon />}
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
