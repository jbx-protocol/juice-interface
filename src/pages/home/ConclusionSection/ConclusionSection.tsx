import { Trans } from '@lingui/macro'
import { Button, Col, Row } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { SectionContainer } from '../SectionContainer'
import { TickIconList } from './TickIconList'
import bannyAndCoins from '/public/assets/juice-homepage-hero.webp'

export function ConclusionSection() {
  return (
    <SectionContainer>
      <Row gutter={100}>
        <Col xs={24} md={12}>
          <Image
            src={bannyAndCoins}
            alt={'Banny leaning on a stack of ETH coins'}
          />
        </Col>
        <Col xs={24} md={12}>
          <div className="flex h-full flex-col justify-center">
            <h3 className="text-4xl">
              <Trans>Join 1,000+ projects growing with Juicebox</Trans>
            </h3>

            <TickIconList />

            <div className="mt-5 flex flex-col flex-wrap gap-2 md:flex-row">
              <Link href="/contact">
                <a>
                  <Button type="default" size="large">
                    <Trans>Contact onboarding</Trans>
                  </Button>
                </a>
              </Link>

              <Link href="/create">
                <a>
                  <Button
                    className={'w-full md:w-auto'}
                    size="large"
                    type="primary"
                  >
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
