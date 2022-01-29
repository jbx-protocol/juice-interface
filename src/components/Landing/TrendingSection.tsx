import { Row, Col, Button } from 'antd'

import { CSSProperties, useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import TrendingProjects from 'components/Projects/TrendingProjects'

export default function TrendingSection() {
  const { isDarkMode } = useContext(ThemeContext)

  const trendingProjects: CSSProperties = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? 'var(--background-l1)' : '#e7e3dc80',
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 0,
  }

  return (
    <section style={trendingProjects}>
      <Row>
        <Col xs={0} md={9}>
          <img
            className="hide-mobile"
            style={{ float: 'right', height: 550, marginTop: 30 }}
            src="/assets/green_orange.png"
            alt="Green orange singing"
          />
        </Col>
        <Col xs={24} md={15}>
          <div style={{ paddingBottom: 20 }}>
            <h3
              style={{
                fontWeight: 600,
                marginBottom: 15,
                fontSize: 22,
                marginTop: 20,
              }}
            >
              Trending projects over the last 7 days
            </h3>
            <TrendingProjects isHomePage />
            <br />
            <Button type="default" style={{ marginBottom: 40 }}>
              <a href="/#/projects">More trending projects</a>
            </Button>
          </div>
        </Col>
      </Row>
    </section>
  )
}
