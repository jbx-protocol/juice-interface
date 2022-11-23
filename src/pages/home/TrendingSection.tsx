import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Row, Space } from 'antd'
import { JuiceTooltip } from 'components/JuiceTooltip'
import Grid from 'components/Grid'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { useTrendingProjects } from 'hooks/Projects'
import Link from 'next/link'
import RankingExplanation from 'pages/projects/RankingExplanation'
import TrendingProjectCard from 'pages/projects/TrendingProjectCard'
import { CSSProperties, useContext } from 'react'
import Payments from './Payments'

const TRENDING_PROJECTS_LIMIT = 6

const SmallHeader = ({ text }: { text: string | JSX.Element }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <h3
      style={{
        fontWeight: 600,
        margin: 0,
        fontSize: '1.3rem',
        color: colors.text.primary,
      }}
    >
      {text}
    </h3>
  )
}

export default function TrendingSection() {
  const isMobile = useMobile()

  const trendingProjectsStyle: CSSProperties = {
    padding: '2rem',
    margin: '0 auto',
  }

  const { data: trendingProjects } = useTrendingProjects(
    TRENDING_PROJECTS_LIMIT,
  )

  return (
    <section style={trendingProjectsStyle}>
      <Row
        style={{ maxWidth: LAYOUT_MAX_WIDTH_PX, margin: '0 auto', rowGap: 40 }}
        gutter={40}
      >
        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <SmallHeader
              text={
                <span>
                  <Trans>Trending projects</Trans>{' '}
                  <JuiceTooltip
                    title={<RankingExplanation />}
                    placement="bottom"
                  >
                    <InfoCircleOutlined style={{ fontSize: 20 }} />
                  </JuiceTooltip>
                </span>
              }
            />

            <Grid list>
              {trendingProjects?.map((p, i) => (
                <TrendingProjectCard
                  project={p}
                  size="sm"
                  rank={i + 1}
                  key={`${p.id}_${p.pv}`}
                />
              ))}
            </Grid>

            <Link href="/projects">
              <a>
                <Button size="large" block={isMobile}>
                  <Trans>More trending projects</Trans>
                </Button>
              </a>
            </Link>
          </Space>
        </Col>

        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <SmallHeader text={<Trans>Latest payments</Trans>} />
            <div style={{ maxHeight: 784, overflow: 'auto' }}>
              <Payments />
            </div>
          </Space>
        </Col>
      </Row>
    </section>
  )
}
