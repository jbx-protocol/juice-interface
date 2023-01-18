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
    <section className="my-24 p-1" id="how-it-works">
      <SectionHeading className="mb-16">
        <Trans>How to Juice</Trans>
      </SectionHeading>

      <div className="my-0 mx-auto max-w-[1080px] p-5">
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
                  Crowdfund your project with ETH. Set a funding target to cover
                  predictable expenses, and any extra funds (
                  <ExternalLink href="https://youtu.be/9Mq5oDh0aBY">
                    overflow
                  </ExternalLink>
                  ) can be claimed by anyone holding your project's tokens
                  alongside you.
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
              <FourthCol header={t`4. Build trust`}>
                <Trans>
                  Changes to your project's funding configuration require a
                  community-approved period to take effect, which acts as a
                  safeguard against rug pulls. Your supporters don't have to
                  trust you — even though they already do.
                </Trans>
              </FourthCol>

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

              <div>
                <Button
                  size="large"
                  type="primary"
                  href="/create"
                  block={isMobile}
                >
                  <Trans>Create a project</Trans>
                </Button>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </section>
  )
}
