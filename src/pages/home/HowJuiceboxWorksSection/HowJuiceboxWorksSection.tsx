import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { XLButton } from 'components/XLButton'
import Image from 'next/image'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { SectionHeading } from '../SectionHeading'

const StepItem = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => (
  <div>
    <h3 className="m-0 text-xl text-black dark:text-slate-100">{header}</h3>
    <p className="mb-0 mt-1">{children}</p>
  </div>
)

export const HowJuiceboxWorksSection = () => {
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
        <Row align="middle" className="gap-16 pl-3 md:gap-0">
          <Col xs={24} sm={12}>
            <div className="grid gap-y-5">
              <StepItem header={t`1. Create your project`}>
                <Trans>
                  Juicebox is the best-in-class tool for crowdfunding your
                  project with ETH – build your supporters’ trust by
                  transparently setting up payouts, token issuance, redemption,
                  and other rules in advance.
                </Trans>
              </StepItem>
              <StepItem header={t`2. Manage your funds`}>
                <Trans>
                  Get paid in ETH, program your own payouts, token issuance, and
                  redemptions to easily run your treasury completely on-chain —
                  as your community grows, you can update your treasury’s rules
                  to grow with it.
                </Trans>
              </StepItem>
              <StepItem header={t`3. Build your community`}>
                <Trans>
                  Issue tokens or NFTs to your supporters and use them for
                  governance, token-gated websites, or redemptions. With
                  flexible token issuance and redemption, your project
                  automatically scales to meet your supporters’ demand.
                </Trans>
              </StepItem>
            </div>
          </Col>
          <Col className="mb-10" xs={24} sm={12}>
            <Image
              width={750}
              height={750}
              src="/assets/sassy-blueberry.png"
              alt="Sassy Juicebox Blueberry crossing arms"
              loading="lazy"
            />
          </Col>
        </Row>
        <div className="mt-5 flex flex-col flex-wrap justify-center gap-3 md:flex-row">
          <ExternalLink href="https://docs.juicebox.money/">
            <a>
              <XLButton type="default" size="large">
                <Trans>Read the docs</Trans>
              </XLButton>
            </a>
          </ExternalLink>

          <Link href="/create">
            <a>
              <XLButton
                type="primary"
                className="w-full md:w-auto"
                size="large"
              >
                <Trans>Create a project</Trans>
              </XLButton>
            </a>
          </Link>
        </div>
      </div>
    </SectionContainer>
  )
}
