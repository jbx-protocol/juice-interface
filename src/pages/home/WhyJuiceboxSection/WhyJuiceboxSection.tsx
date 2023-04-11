import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { DEFAULT_HOMEPAGE_GUTTER } from '../Landing'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'
import { WhyJuiceboxCard } from './WhyJuiceboxCard'

function WhyJuiceboxCards() {
  const spacerCol = <Col xs={0} md={4}></Col>
  return (
    <>
      <Row gutter={DEFAULT_HOMEPAGE_GUTTER}>
        <WhyJuiceboxCard
          bgClass="bg-melon-400 dark:bg-melon-500"
          iconBgClass="bg-melon-200 dark:bg-melon-800"
          iconSrc="/assets/community-icon.png"
          iconAlt="Community icon"
          heading={t`Community owned`}
          content={
            <Trans>
              Juicebox is owned and governed by the people — its builders,
              supporters, and project creators using the protocol.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          bgClass="bg-peel-400"
          iconBgClass="bg-peel-100 dark:bg-peel-800"
          iconSrc="/assets/lightning-icon.png"
          iconAlt="Lightning icon"
          heading={t`Battle tested`}
          content={
            <Trans>
              Juicebox is reliable, open-source, audited, and has been
              battle-tested by more than 1,000 projects raising over 50,000 ETH.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          bgClass="bg-grape-400"
          iconBgClass="bg-grape-200 dark:bg-grape-800"
          iconSrc="/assets/trust-icon.png"
          iconAlt="Shield icon"
          heading={t`Trust minimized`}
          content={
            <Trans>
              Juicebox is non-custodial, meaning you have complete ownership
              over your project and its funds. Easily customize your own
              on-chain rules.
            </Trans>
          }
        />
      </Row>
      <Row gutter={DEFAULT_HOMEPAGE_GUTTER} className="mt-8">
        {spacerCol}
        <WhyJuiceboxCard
          bgClass="bg-crush-400 dark:bg-crush-400"
          iconBgClass="bg-crush-200 dark:bg-crush-800"
          iconSrc="/assets/flexible-arrow-icon.png"
          iconAlt="Flexible arrow"
          heading={t`Flexible`}
          content={
            <Trans>
              Whether you’re building a boutique crypto law firm or the next
              mega-fundraiser, Juicebox is customizable to match your needs.
            </Trans>
          }
        />
        <WhyJuiceboxCard
          bgClass="bg-split-400"
          iconBgClass="bg-split-200 dark:bg-split-800"
          iconSrc="/assets/cube-icon.png"
          iconAlt="Extensible box icon"
          heading={t`Extensible`}
          content={
            <Trans>
              Safe, Snapshot, or even on-chain governance: Juicebox uses simple
              standards and works with all of your favorite Ethereum tools.
            </Trans>
          }
        />
        {spacerCol}
      </Row>
    </>
  )
}

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
      <WhyJuiceboxCards />
    </SectionContainer>
  )
}
