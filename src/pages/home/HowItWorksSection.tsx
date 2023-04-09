import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Row } from 'antd'
import ExternalLink from 'components/ExternalLink'
import useMobile from 'hooks/Mobile'
import Image from 'next/image'
import Link from 'next/link'
import { helpPagePath } from 'utils/routes'
import { SectionHeading } from './SectionHeading'

const FourthCol = ({
  header,
  children,
}: React.PropsWithChildren<{ header: string }>) => (
  <div>
    <h3 className="m-0 text-xl text-black dark:text-slate-100">{header}</h3>
    <p className="mb-0 mt-1">{children}</p>
  </div>
)

export function HowItWorksSection() {
  const isMobile = useMobile()

  return (
    <section className="my-12 p-8" id="how-it-works">
      <SectionHeading className="mb-8">
        <Trans>How Juicebox Works</Trans>
      </SectionHeading>

      <div className="my-0 mx-auto max-w-5xl p-5">
        <Row align="middle">
          {!isMobile && (
            <Col className="mb-10" xs={24} sm={11}>
              <Image
                width={750}
                height={750}
                src="/assets/sassy-blueberry.png"
                alt="Sassy Juicebox Blueberry crossing arms"
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

              <Link href="/create">
                <a>
                  <Button size="large" type="primary" block={isMobile}>
                    <Trans>Build your project</Trans>
                  </Button>
                </a>
              </Link>

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
                    risks{' '}
                  </ExternalLink>
                  of crypto fundraising!
                </Trans>
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
