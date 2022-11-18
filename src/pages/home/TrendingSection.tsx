import { InfoCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Col, Row, Space, Tooltip } from 'antd'
import Grid from 'components/Grid'
import useMobile from 'hooks/Mobile'
import { useTrendingProjects } from 'hooks/Projects'
import Link from 'next/link'
import RankingExplanation from 'pages/projects/RankingExplanation'
import TrendingProjectCard from 'pages/projects/TrendingProjectCard'
import { CSSProperties } from 'react'
import Payments from './Payments'

const TRENDING_PROJECTS_LIMIT = 6

const SmallHeader = ({ text }: { text: string | JSX.Element }) => (
  <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1.3rem' }}>{text}</h3>
)

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
      <Row style={{ maxWidth: 1200, margin: '0 auto' }} gutter={40}>
        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <SmallHeader
              text={
                <span>
                  <Trans>Trending projects</Trans>{' '}
                  <Tooltip title={<RankingExplanation />} placement="bottom">
                    <InfoCircleOutlined style={{ fontSize: 20 }} />
                  </Tooltip>
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
          </Space>

          <Row
            justify="center"
            style={{
              padding: '1rem 0 2rem 0',
            }}
          >
            <Link href="/projects">
              <Button size="large" block={isMobile}>
                <Trans>More trending projects</Trans>
              </Button>
            </Link>
          </Row>
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
