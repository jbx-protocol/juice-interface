import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Divider, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import Image from 'next/image'
import { useContext } from 'react'
import { helpPagePath } from 'utils/routes'
import { OverflowVideoLink } from './QAs'
import { SectionHeading } from './SectionHeading'

const SmallHeader = ({ text }: { text: string }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <h3
      style={{
        fontWeight: 600,
        margin: 0,
        color: colors.text.primary,
      }}
    >
      {text}
    </h3>
  )
}

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
  const isMobile = useMobile()

  return (
    <section
      id="how-it-works"
      style={{
        margin: '40px 0',
        padding: '2rem',
      }}
    >
      <SectionHeading
        style={{
          marginBottom: '4rem',
        }}
      >
        <Trans>How to Juice</Trans>
      </SectionHeading>

      <div
        style={{
          maxWidth: LAYOUT_MAX_WIDTH_PX,
          margin: '0 auto',
        }}
      >
        <Row align="middle">
          {!isMobile && (
            <Col xs={24} sm={11}>
              <Image
                style={{
                  marginBottom: 40,
                }}
                width={486}
                height={486}
                src="/assets/pina.png"
                alt="Pinepple geek artist holding a paintbrush"
                loading="lazy"
              />
            </Col>
          )}

          <Col xs={24} sm={13}>
            <div style={{ display: 'grid', rowGap: 20, marginBottom: 40 }}>
              <FourthCol header={t`1. Get funded.`}>
                <Trans>
                  Crowdfund your project with ETH. Set a funding target to cover
                  predictable expenses, and any extra funds (
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

              <Divider
                style={{ width: '50px', margin: '0 auto', minWidth: 'unset' }}
              />

              <p>
                <InfoCircleOutlined />{' '}
                <Trans>
                  Juicebox isn't guaranteed to be free of bugs or exploits.
                  Before spending money, do your own research.{' '}
                  <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                    Ask questions
                  </ExternalLink>
                  , check out the{' '}
                  <ExternalLink href="https://github.com/jbx-protocol/juice-interface">
                    code
                  </ExternalLink>
                  , and understand the{' '}
                  <ExternalLink href={helpPagePath('/dev/learn/risks')}>
                    risks
                  </ExternalLink>
                  !
                </Trans>
              </p>
            </div>
          </Col>
        </Row>
        <div style={{ textAlign: 'center' }}>
          <Button size="large" type="primary" href="/create" block={isMobile}>
            <Trans>Create a project</Trans>
          </Button>
        </div>
      </div>
    </section>
  )
}
