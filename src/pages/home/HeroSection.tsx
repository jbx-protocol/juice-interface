import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { fathom } from 'lib/fathom'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { classNames } from 'utils/classNames'
import { BigHeading } from './BigHeading'
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
  const isMobile = useMobile()

  return (
    <div
      className={classNames(
        'flex flex-wrap gap-2',
        isMobile ? 'flex-col' : 'flex-row',
      )}
    >
      <Link href="/projects">
        <a>
          <Button
            className={classNames(isMobile ? 'mr-0 mb-3' : 'mr-3 mb-0')}
            type="primary"
            size="large"
            block={isMobile}
          >
            <Trans>Explore projects</Trans>
          </Button>
        </a>
      </Link>

      <Link href="/create">
        <a>
          <Button
            size="large"
            block={isMobile}
            onClick={() => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              ;(fathom as any)?.trackGoal('IIYVJKNC', 0)
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
  const isMobile = useMobile()

  return (
    <section className="mt-20 mb-24 px-10">
      <div className="my-0 mx-auto max-w-[1080px]">
        <Row gutter={30} align="middle">
          <Col className="flex items-center pb-6" xs={24} md={14}>
            <div>
              <Space direction="vertical" size="large">
                <BigHeading className="md:text-7xl" text={<HeroHeading />} />
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
          {!isMobile && (
            <Col xs={24} md={10}>
              <Image
                className="hide-mobile"
                src={forThemeOption?.({
                  [ThemeOption.dark]: bananaOd,
                  [ThemeOption.light]: bananaOl,
                })}
                alt="Banny the chill Juicebox banana drinking juice"
              />
            </Col>
          )}
        </Row>
      </div>
    </section>
  )
}
