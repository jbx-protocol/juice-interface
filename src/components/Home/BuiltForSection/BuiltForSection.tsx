import { t, Trans } from '@lingui/macro'
import { BuiltForCard } from 'components/Home/BuiltForSection/BuiltForCard'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { useRef } from 'react'

export function BuiltForSection() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <SectionContainer>
      <SectionHeading
        heading={<Trans>Built for ideas like yours</Trans>}
        subheading={
          <Trans>
            Juicebox is as versatile as you are, build anything from an NFT
            project to a boutique crypto lawfirm and everything in between.
          </Trans>
        }
      />
      <div
        className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
        ref={containerRef}
      >
        <BuiltForCard
          card="daos"
          heading={t`DAOs`}
          subheading={
            <Trans>
              Launch a Decentralized Autonomous Organisation with governance in
              minutes.
            </Trans>
          }
        />
        <BuiltForCard
          card="crowdfunding"
          heading={t`Crowdfunding`}
          subheading={
            <Trans>
              All-in-one crowdfunding with powerful treasury management and
              redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          card="nfts"
          heading={t`NFT Projects`}
          subheading={
            <Trans>
              Build and launch your NFT project right here on Juicebox with
              built-in redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          card="builders"
          heading={t`Creators & builders`}
          subheading={
            <Trans>
              Whatever you're building or creating — get it launched and funded
              on Juicebox.
            </Trans>
          }
        />
      </div>
    </SectionContainer>
  )
}
