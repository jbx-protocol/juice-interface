import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Divider, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import useMobile from 'hooks/Mobile'
import Image from 'next/image'
import { helpPagePath } from 'utils/routes'
import { SectionHeading } from './SectionHeading'

const SmallHeader = ({ text }: { text: string }) => {
  return (
    <h3 className="m-0 font-medium text-black dark:text-slate-100">{text}</h3>
  )
}

const FourthCol = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => (
  <div>
    <SmallHeader text={header} />
    <p className="mb-0 mt-1">{children}</p>
  </div>
)

export function HowItWorksSection() {
  const isMobile = useMobile()

  return (
    <section className="my-20 p-1" id="how-it-works">
      <SectionHeading className="mb-8">
        <Trans>How Juicebox Works</Trans>
      </SectionHeading>

      <div className="my-0 mx-auto max-w-5xl p-5">
        <Row align="middle">
          {!isMobile && (
            <Col className="mb-10" xs={24} sm={11}>
              <Image
                width={486}
                height={486}
                src="/assets/pina.png"
                alt="Juicebox pinepple geek artist holding a paintbrush"
                loading="lazy"
              />
            </Col>
          )}

          <Col xs={24} sm={13}>
            <div className="grid gap-y-5">
              <FourthCol header={t`1. Get funded`}>
                <Trans>
                  Crowdfund your project with ETH. When someone pays your
                  project, they'll receive your project's tokens (or NFTs) — use
                  tokens to grant governance rights, community access, or other
                  membership perks.
                </Trans>
              </FourthCol>
              <FourthCol header={t`2. Build trust`}>
                <Trans>
                  Transparently set your terms ahead of time, or take control
                  when you need to. Juicebox lets you define elegant token
                  issuance & redemption, payouts, and other rules in advance,
                  acting as a safeguard against rug pulls. Your supporters don't
                  have to trust you — even though they already do.
                </Trans>
              </FourthCol>
              <FourthCol header={t`3. Stay flexible`}>
                <Trans>
                  As your community grows, scale your project with it: Juicebox
                  lets you update your payouts, token issuance & redemption, and
                  other rules over time to meet your community's evolving needs.
                  Run your community how you want to, with our pre-built
                  integrations for{' '}
                  <ExternalLink href="https://safe.global/">Safe</ExternalLink>,{' '}
                  <ExternalLink href="https://snapshot.org">
                    Snapshot
                  </ExternalLink>
                  , and the other tools you already use.
                </Trans>
              </FourthCol>

              <div>
                <Button
                  size="large"
                  type="primary"
                  href="/create"
                  block={isMobile}
                >
                  <Trans>Build your project</Trans>
                </Button>
              </div>

              <Divider className="mx-0 my-auto w-12 min-w-[unset]" />

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
      </div>
    </section>
  )
}
