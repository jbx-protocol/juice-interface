import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { BuiltForCard } from './BuiltForCard'

export function BuiltForSection() {
  const { forThemeOption } = useContext(ThemeContext)
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
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/images/dao_od.png',
            light: '/assets/images/dao_ol.png',
          })}
          imageAlt="Juicy Grapes"
          heading={t`DAOs`}
          subheading={
            <Trans>
              Launch a Decentralized Autonomous Organisation with governance in
              minutes.
            </Trans>
          }
        />
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/images/crowdfunding_od.png',
            light: '/assets/images/crowdfunding_ol.png',
          })}
          imageAlt="ETH coins"
          heading={t`Crowdfunding`}
          subheading={
            <Trans>
              All-in-one crowdfunding with powerful treasury management and
              redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/images/nft_od.png',
            light: '/assets/images/nft_ol.png',
          })}
          imageAlt="Framed NFT"
          heading={t`NFT Projects`}
          subheading={
            <Trans>
              Build and launch your NFT project right here on Juicebox with
              built-in redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/images/builders_od.png',
            light: '/assets/images/builders_ol.png',
          })}
          imageAlt="Builder hodling wrench"
          heading={t`Creators & builders`}
          subheading={
            <Trans>
              Whatever you’re building or creating — get it launched and funded
              on Juicebox.
            </Trans>
          }
        />
      </div>
    </SectionContainer>
  )
}
