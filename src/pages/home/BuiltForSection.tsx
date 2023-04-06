import { t, Trans } from '@lingui/macro'
import { Row } from 'antd'
import { BuildForCard } from './BuiltForCard'
import { SectionContainerClasses } from './Landing'
import { SectionHeading } from './SectionHeading'

export function BuiltForSection() {
  return (
    <section className={SectionContainerClasses}>
      <SectionHeading
        heading={<Trans>Built for ideas like yours</Trans>}
        subheading={
          <Trans>
            Juicebox is as versatile as you are, build anything from an NFT
            project to a boutique crypto lawfirm and everything in between.
          </Trans>
        }
      />
      <Row gutter={[30, 30]}>
        <BuildForCard
          imageSrc="/assets/built-for-daos.png"
          imageAlt="Juicy Grapes"
          heading={t`DAOs`}
          subheading={
            <Trans>
              Launch a Decentralised Autonomous Organisation with governance in
              minutes.
            </Trans>
          }
        />
        <BuildForCard
          imageSrc="/assets/built-for-crowdfunding.png"
          imageAlt="ETH coins"
          heading={t`Crowdfunding`}
          subheading={
            <Trans>
              An all-in-one crowdfunding with powerful treasury management and
              redemptions.
            </Trans>
          }
        />
        <BuildForCard
          imageSrc="/assets/built-for-nft-projects.png"
          imageAlt="Beautifully framed NFT"
          heading={t`NFT Projects`}
          subheading={
            <Trans>
              Build and launch your NFT project right here on Juicebox with
              built-in redemptions.
            </Trans>
          }
        />
        <BuildForCard
          imageSrc="/assets/built-for-creators.png"
          imageAlt="Builder hodling wrench"
          heading={t`Creators & builders`}
          subheading={
            <Trans>
              Whatever you’re building or creating — get it launched and funded
              on Juicebox.
            </Trans>
          }
        />
      </Row>
    </section>
  )
}
