import { Trans } from '@lingui/macro'
import { Button, Col, Row } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { TickIconList } from './TickIconList'

export function ConclusionSection() {
  return (
    <SectionContainer className="max-w-7xl">
      <Row gutter={100} className="flex-col-reverse md:flex-row">
        <Col xs={24} md={12} className="pt-10 md:pt-0">
          <div className="mx-auto w-full max-w-sm">
            <Image
              src={'/assets/images/juice-homepage-hero.webp'}
              alt={'Banny leaning on a stack of ETH coins'}
              width={558}
              height={496}
            />
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-4xl">
              <Trans>Join 1,000+ projects growing with Juicebox</Trans>
            </h2>

            <TickIconList />

            <div className="mt-5 flex flex-col flex-wrap gap-2 md:flex-row">
              <Link href="/contact">
                <a className="w-full lg:w-auto">
                  <Button type="default" size="large" className="w-full">
                    <Trans>Contact onboarding</Trans>
                  </Button>
                </a>
              </Link>

              <Link href="/create">
                <a className="w-full lg:w-auto">
                  <Button className="w-full" size="large" type="primary">
                    <Trans>Create a project</Trans>
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </SectionContainer>
  )
}
