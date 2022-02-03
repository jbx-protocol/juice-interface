import { Row, Col, Button, Tooltip, Collapse } from 'antd'
import { DownOutlined, UpOutlined, InfoCircleOutlined } from '@ant-design/icons'

import { CSSProperties, useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import TrendingProjects from 'components/Projects/TrendingProjects'
import RankingExplanation from 'components/Projects/RankingExplanation'
import { Trans } from '@lingui/macro'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

export default function TrendingSection() {
  const {
    theme: { colors },
    isDarkMode,
  } = useContext(ThemeContext)

  const [trendingWindow, setTrendingWindow] = useState<number>(7)
  const [activeKey, setActiveKey] = useState<0 | undefined>()

  const trendingProjectsStyle: CSSProperties = {
    // Light theme uses a slightly lighter background than background-l1
    backgroundColor: isDarkMode ? colors.background.l1 : '#e7e3dc80',
    margin: '150px 0',
    paddingTop: 40,
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
  }

  const arrowIconSize = 14

  const arrowIconStyle: CSSProperties = {
    fontSize: arrowIconSize,
    marginLeft: 5,
  }

  // Close dropdown when clicking anywhere in the window
  window.addEventListener('click', () => setActiveKey(undefined), false)

  const trendingWindowSelect = () => {
    return (
      <Collapse
        className="trending-window-select"
        style={{ border: 'none' }}
        activeKey={activeKey}
      >
        <CollapsePanel
          style={{
            border: 'none',
          }}
          key={0}
          showArrow={false}
          header={
            <div
              onClick={e => {
                setActiveKey(activeKey === 0 ? undefined : 0)
                e.stopPropagation()
              }}
            >
              {trendingWindow} days
              {activeKey === 0 ? (
                <UpOutlined style={arrowIconStyle} />
              ) : (
                <DownOutlined style={arrowIconStyle} />
              )}
            </div>
          }
        >
          <div onClick={e => e.stopPropagation()}>
            <option
              className={`select-item ${
                trendingWindow === 7 ? 'selected' : ''
              }`}
              onClick={() => setTrendingWindow(7)}
            >
              7 days
            </option>
            <option
              className={`select-item ${
                trendingWindow === 30 ? 'selected' : ''
              }`}
              onClick={() => setTrendingWindow(30)}
            >
              30 days
            </option>
          </div>
        </CollapsePanel>
      </Collapse>
    )
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
            <h3 style={headingStyles}>
              <Trans>
                Trending projects over the last {trendingWindowSelect()}
              </Trans>{' '}
              <Tooltip
                title={<RankingExplanation trendingWindow={trendingWindow} />}
                placement="bottom"
              >
                <InfoCircleOutlined />
              </Tooltip>
            </h3>
            <TrendingProjects
              count={6}
              trendingWindowDays={trendingWindow}
              isHomePage
            />
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
