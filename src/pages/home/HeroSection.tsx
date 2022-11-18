import { t, Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { fathom } from 'lib/fathom'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import { BigHeading } from './BigHeading'
import { HeroHeading, HeroSubheading } from './strings'
import bananaOd from '/public/assets/banana-od.webp'
import bananaOl from '/public/assets/banana-ol.webp'
import bolt from '/public/assets/icons/bolt.svg'

function BuiltForList() {
  return (
    <div
      style={{
        display: 'grid',
        gridAutoFlow: 'row',
        rowGap: 8,
        fontWeight: 500,
      }}
    >
      <p
        style={{
          marginBottom: 4,
        }}
      >
        <Trans>Built for:</Trans>
      </p>
      {[
        t`DAOs`,
        t`Crowdfunding`,
        t`NFT projects`,
        t`Indie creators and builders`,
      ].map((data, i) => (
        <Space style={{ paddingLeft: 8 }} key={i} size="middle">
          <Image src={bolt} alt="⚡️" />
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
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8,
        flexDirection: isMobile ? 'column' : 'row',
      }}
    >
      <Link href="/projects">
        <a>
          <Button
            type="primary"
            size="large"
            block={isMobile}
            style={{
              marginRight: isMobile ? 0 : '0.8rem',
              marginBottom: isMobile ? '0.8rem' : 0,
            }}
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
    <section
      style={{
        paddingLeft: 40,
        paddingRight: 40,
        marginTop: 40,
        marginBottom: 100,
      }}
    >
      <div style={{ maxWidth: LAYOUT_MAX_WIDTH_PX, margin: '0 auto' }}>
        <Row gutter={30} align="middle">
          <Col
            xs={24}
            md={13}
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingBottom: 25,
            }}
          >
            <div>
              <Space direction="vertical" size="large">
                <BigHeading
                  text={<HeroHeading />}
                  style={{ fontSize: !isMobile ? '3.8rem' : '2.3rem' }}
                />
                <div
                  style={{
                    marginBottom: '1rem',
                  }}
                >
                  <div
                    style={{
                      fontWeight: 500,
                      fontSize: '1rem',
                      marginBottom: '1rem',
                    }}
                  >
                    <HeroSubheading />
                  </div>

                  <BuiltForList />
                </div>

                <CallToAction />
              </Space>
            </div>
          </Col>
          {!isMobile && (
            <Col xs={24} md={11}>
              <Image
                className="hide-mobile"
                src={forThemeOption?.({
                  [ThemeOption.dark]: bananaOd,
                  [ThemeOption.light]: bananaOl,
                })}
                alt="Chill banana drinking juice"
              />
            </Col>
          )}
        </Row>
      </div>
    </section>
  )
}
