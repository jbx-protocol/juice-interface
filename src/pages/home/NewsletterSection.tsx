import { Trans } from '@lingui/macro'
import { Button, Col, Row } from 'antd'
import useMobile from 'hooks/Mobile'
import Image from 'next/image'
import { SectionHeading } from './SectionHeading'
import blueberry from '/public/assets/blueberry-ol.png'

export function NewsletterSection() {
  const isMobile = useMobile()

  return (
    <section className="bg-smoke-50 p-8 py-20 px-7 text-black dark:bg-slate-600">
      <div className="my-0 mx-auto max-w-5xl">
        <Row align="middle" gutter={40}>
          <Col xs={24} md={14}>
            <SectionHeading className="mb-6 text-left text-black dark:text-slate-100">
              <Trans>Stay up to date.</Trans>
            </SectionHeading>
            <div className="text-black">
              <p className="mb-6 text-base text-black dark:text-slate-100">
                Subscribe to our newsletter to get the latest updates from the
                Juicebox ecosystem.
              </p>
              <Button
                size="large"
                type="primary"
                href="https://newsletter.juicebox.money"
                target="_blank"
                rel="noopener noreferrer"
                block={isMobile}
              >
                Subscribe Now
              </Button>
            </div>
          </Col>

          {!isMobile && (
            <Col xs={24} md={10}>
              <Image
                src={blueberry}
                alt="Sexy Juicebox blueberry with bright pink lipstick spraying a can of spraypaint"
                loading="lazy"
              />
            </Col>
          )}
        </Row>
      </div>
    </section>
  )
}
