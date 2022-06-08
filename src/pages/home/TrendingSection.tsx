import { Row, Col, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import TrendingProjects from 'pages/projects/TrendingProjects'
import RankingExplanation from 'pages/projects/RankingExplanation'
import { Trans } from '@lingui/macro'

import useMobile from 'hooks/Mobile'

export default function TrendingSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const trendingProjectsStyle: CSSProperties = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? colors.background.l1 : '#faf7f5',
    marginTop: '3rem',
    paddingTop: !isMobile ? 40 : 80,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 0,
  }

  const headingStyles: CSSProperties = {
    fontWeight: 600,
    marginBottom: 15,
    fontSize: 22,
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
  }

  return (
    <section style={trendingProjectsStyle}>
      <Row style={{ maxWidth: 1200, margin: 'auto' }}>
        <Col
          xs={0}
          lg={8}
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <img
            className="hide-mobile hide-tablet"
            style={{ height: 550 }}
            src="/assets/green_orange.png"
            alt="Green orange singing"
          />
        </Col>
        <Col xs={24} lg={15}>
          <div style={{ paddingBottom: 20 }}>
            <h2 style={headingStyles}>
              <Trans>
                <span style={{ marginRight: 12 }}>Trending projects</span>
                <Tooltip
                  title={<RankingExplanation trendingWindow={7} />}
                  placement="bottom"
                >
                  <InfoCircleOutlined style={{ fontSize: 20 }} />
                </Tooltip>
              </Trans>
            </h2>
            <TrendingProjects count={6} trendingWindowDays={7} isHomePage />
          </div>
        </Col>
      </Row>
    </section>
  )
}
