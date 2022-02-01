import { Row, Col, Button, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import TrendingProjects from 'components/Projects/TrendingProjects'
import { t, Trans } from '@lingui/macro'

export default function TrendingSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const trendingProjectsStyle: CSSProperties = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? colors.background.l1 : '#e7e3dc80',
    margin: '150px 0',
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 0,
  }

  return (
    <section style={trendingProjectsStyle}>
      <Row style={{ maxWidth: 1200, margin: 'auto' }}>
        <Col xs={0} lg={8}>
          <img
            className="hide-mobile hide-tablet"
            style={{ height: 550, marginTop: 20 }}
            src="/assets/green_orange.png"
            alt="Green orange singing"
          />
        </Col>
        <Col xs={24} lg={15}>
          <div style={{ paddingBottom: 20 }}>
            <h3
              style={{
                fontWeight: 600,
                marginBottom: 15,
                fontSize: 22,
                marginTop: 20,
              }}
            >
              <Trans>Trending projects over the last 7 days</Trans>{' '}
              <Tooltip
                title={t`Rankings based on volume and % volume gained in
                the last 7 days.`}
              >
                <InfoCircleOutlined />
              </Tooltip>
            </h3>
            <TrendingProjects count={6} isHomePage />
            <Button type="default" style={{ marginBottom: 40, marginTop: 15 }}>
              <a href="/#/projects/?tab=trending">
                <Trans>More trending projects</Trans>
              </a>
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  )
}
