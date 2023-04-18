import { t, Trans } from '@lingui/macro'
import { Button, Col, Row } from 'antd'
import { HOMEPAGE } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import Image from 'next/image'
import Link from 'next/link'
import { HeroHeading, HeroSubheading } from './strings'
import bolt from '/public/assets/icons/bolt.svg'
import juiceHero from '/public/assets/images/juice-homepage-hero.webp'

function BuiltForList() {
  return (
    <div className="grid grid-flow-row gap-y-2 text-base font-medium">
      <p className="mb-1">
        <Trans>Built for:</Trans>
      </p>
      {[
        t`DAOs`,
        t`Crowdfunding`,
        t`NFT projects`,
        t`Indie creators and builders`,
      ].map((data, i) => (
        <div className="flex gap-4 pl-2" key={i}>
          <Image src={bolt} alt="Lightning bolt symbol" />
          {data}
        </div>
      ))}
    </div>
  )
}

const CallToAction = () => {
  return (
    <div className="flex flex-col flex-wrap gap-2 md:flex-row">
      <Link href="/projects">
        <a>
          <Button
            className={'mr-0 mb-3 w-full md:mr-3 md:mb-0 md:w-auto'}
            type="primary"
            size="large"
            onClick={() => {
              trackFathomGoal(HOMEPAGE.EXPLORE_PROJECTS_CTA)
            }}
          >
            <Trans>Explore projects</Trans>
          </Button>
        </a>
      </Link>

      <Link href="/create">
        <a>
          <Button
            className={'w-full md:w-auto'}
            size="large"
            onClick={() => {
              trackFathomGoal(HOMEPAGE.CREATE_A_PROJECT_CTA)
            }}
          >
            <Trans>Create a project</Trans>
          </Button>
        </a>
      </Link>
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="mt-20 mb-24 px-10">
      <div className="my-0 mx-auto max-w-6xl">
        <Row gutter={30} align="middle">
          <Col className="flex items-center pb-6" xs={24} md={13}>
            <div>
              <div className="flex flex-col gap-6">
                <h1 className="text-brand m-0 text-5xl md:text-6xl">
                  <HeroHeading />
                </h1>
                <div className="mb-4">
                  <div className="mb-10 text-base">
                    <HeroSubheading />
                  </div>

                  <BuiltForList />
                </div>

                <CallToAction />
              </div>
            </div>
          </Col>
          <Col xs={24} md={11} className="hidden md:block">
            <Image
              src={juiceHero}
              alt="Banny the chill Juicebox banana drinking juice"
              priority
            />
          </Col>
        </Row>
      </div>
    </section>
  )
}
