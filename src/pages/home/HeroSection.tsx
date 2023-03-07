import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import { HOMEPAGE } from 'constants/fathomEvents'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import { trackFathomGoal } from 'lib/fathom'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { HeroHeading, HeroSubheading } from './strings'
import bananaOd from '/public/assets/banana-od.webp'
import bananaOl from '/public/assets/banana-ol.webp'
import bolt from '/public/assets/icons/bolt.svg'

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
        <Space className="pl-2" key={i} size="middle">
          <Image src={bolt} alt="Lightning bolt symbol" />
          {data}
        </Space>
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
  const { forThemeOption } = useContext(ThemeContext)

  return (
    <section className="mt-20 mb-24 px-10">
      <div className="my-0 mx-auto max-w-6xl">
        <Row gutter={30} align="middle">
          <Col className="flex items-center pb-6" xs={24} md={14}>
            <div>
              <Space direction="vertical" size="large">
                <h1 className="text-brand m-0 text-5xl font-semibold md:text-7xl">
                  <HeroHeading />
                </h1>
                <div className="mb-4">
                  <div className="mb-4 text-base font-medium">
                    <HeroSubheading />
                  </div>

                  <BuiltForList />
                </div>

                <CallToAction />
              </Space>
            </div>
          </Col>
          <Col xs={24} md={10} className="hidden md:block">
            <Image
              src={forThemeOption?.({
                [ThemeOption.dark]: bananaOd,
                [ThemeOption.light]: bananaOl,
              })}
              alt="Banny the chill Juicebox banana drinking juice"
              priority
            />
          </Col>
        </Row>
      </div>
    </section>
  )
}
