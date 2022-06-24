import { t, Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import ExternalLink from 'components/shared/ExternalLink'
import { CSSProperties } from 'react'

import { OverflowVideoLink } from './QAs'

const SmallHeader = ({ text }: { text: string }) => (
  <h3 style={{ fontWeight: 600, margin: 0 }}>{text}</h3>
)

const FourthCol = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => (
  <div>
    <SmallHeader text={header} />
    <p style={{ marginBottom: 0, marginTop: 5 }}>{children}</p>
  </div>
)

export function HowItWorksSection() {
  const totalMaxWidth = 1080

  const wrapper: CSSProperties = {
    maxWidth: totalMaxWidth,
    margin: '0 auto',
  }
  return (
    <section
      id="how-it-works"
      style={{
        margin: '40px 0',
        padding: '2rem',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '2.5rem',
          marginBottom: '4rem',
        }}
      >
        <Trans>How to Juice.</Trans>
      </h2>

      <div
        style={{
          ...wrapper,
        }}
      >
        <Row align="middle">
          <Col xs={24} sm={11}>
            <img
              style={{
                maxHeight: 480,
                maxWidth: '100%',
                objectFit: 'contain',
                marginBottom: 40,
              }}
              src="/assets/pina.png"
              alt="Pinepple geek artist holding a paintbrush"
              loading="lazy"
            />
          </Col>
          <Col xs={24} sm={13}>
            <div style={{ display: 'grid', rowGap: 20, marginBottom: 40 }}>
              <FourthCol header={t`1. Get funded.`}>
                <Trans>
                  Raise ETH for your thing. Set a funding target to cover
                  predictable expenses. Any extra funds (
                  <OverflowVideoLink>overflow</OverflowVideoLink>) can be
                  claimed by anyone holding your project's tokens alongside you.
                </Trans>
              </FourthCol>
              <FourthCol header={t`2. Give ownership`}>
                <Trans>
                  When someone pays your project, they'll receive your project's
                  tokens in return. Tokens can be redeemed for a portion of your
                  project's overflow funds; when you win, your community wins
                  with you. Leverage your project's token to grant governance
                  rights, community access, or other membership perks.
                </Trans>
              </FourthCol>
              <FourthCol header={t`3. Manage your funds`}>
                <Trans>
                  Commit portions of your funds to the people or projects you
                  want to support, or the contributors you want to pay. When you
                  get paid, so do they.
                </Trans>
              </FourthCol>
              <FourthCol header={t`4. Build trust.`}>
                <Trans>
                  Changes to your project's funding configuration require a
                  community-approved period to take effect, which acts as a
                  safeguard against rug pulls. Your supporters don't have to
                  trust you — even though they already do.
                </Trans>
              </FourthCol>

              <p>
                <Trans>
                  Note: Juicebox is new, unaudited, and not guaranteed to work
                  perfectly. Before spending money, do your own research:{' '}
                  <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                    ask questions
                  </ExternalLink>
                  ,{' '}
                  <ExternalLink href="https://github.com/jbx-protocol/juice-interface">
                    check out the code
                  </ExternalLink>
                  , and understand the risks!
                </Trans>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
