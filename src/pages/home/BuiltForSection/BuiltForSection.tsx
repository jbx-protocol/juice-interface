import { t, Trans } from '@lingui/macro'
import { Row } from 'antd'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { useContext } from 'react'
import { DEFAULT_HOMEPAGE_GUTTER } from '../Landing'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { BuiltForCard } from './BuiltForCard'

export const BuiltForSection = () => {
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
      <Row gutter={DEFAULT_HOMEPAGE_GUTTER}>
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/homepageBuiltForSection/dao_od.png',
            light: '/assets/homepageBuiltForSection/dao_ol.png',
          })}
          imageAlt="Juicy Grapes"
          heading={t`DAOs`}
          subheading={
            <Trans>
              Launch a Decentralised Autonomous Organisation with governance in
              minutes.
            </Trans>
          }
        />
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/homepageBuiltForSection/crowdfunding_od.png',
            light: '/assets/homepageBuiltForSection/crowdfunding_ol.png',
          })}
          imageAlt="ETH coins"
          heading={t`Crowdfunding`}
          subheading={
            <Trans>
              An all-in-one crowdfunding with powerful treasury management and
              redemptions.
            </Trans>
          }
        />
        <BuiltForCard
          imageSrc={forThemeOption?.({
            dark: '/assets/homepageBuiltForSection/nft_od.png',
            light: '/assets/homepageBuiltForSection/nft_ol.png',
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
            dark: '/assets/homepageBuiltForSection/builders_od.png',
            light: '/assets/homepageBuiltForSection/builders_ol.png',
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
      </Row>
    </SectionContainer>
  )
}
