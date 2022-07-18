import { Row, Col, Tooltip, Space, Button } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import RankingExplanation from 'pages/projects/RankingExplanation'
import { Trans } from '@lingui/macro'

import { useTrendingProjects } from 'hooks/Projects'
import TrendingProjectCard from 'pages/projects/TrendingProjectCard'
import Grid from 'components/Grid'

import useMobile from 'hooks/Mobile'

import Payments from './Payments'

export default function TrendingSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const trendingProjectsStyle: CSSProperties = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? colors.background.l1 : '#faf7f5',
    padding: '2rem',
    margin: '0 auto',
  }

  const SmallHeader = ({ text }: { text: string | JSX.Element }) => (
    <h3 style={{ fontWeight: 600, margin: 0, fontSize: '1.3rem' }}>{text}</h3>
  )

  const { data: projects } = useTrendingProjects(6, 7)

  return (
    <section style={trendingProjectsStyle}>
      <Row style={{ maxWidth: 1200, margin: '0 auto' }} gutter={40}>
        <Col xs={24} md={12}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <SmallHeader
              text={
                <span>
                  <Trans>Trending projects</Trans>{' '}
                  <Tooltip
                    title={<RankingExplanation trendingWindow={7} />}
                    placement="bottom"
                  >
                    <InfoCircleOutlined style={{ fontSize: 20 }} />
                  </Tooltip>
                </span>
              }
            />

            <Grid list>
              {projects?.map((p, i) => (
                <TrendingProjectCard
                  project={p}
                  size={'sm'}
                  rank={i + 1}
                  key={`${p.id}_${p.cv}`}
                  trendingWindowDays={7}
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
            <Button size="large" href="/projects" block={isMobile}>
              <Trans>More trending projects</Trans>
            </Button>
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
