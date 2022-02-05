import { Row, Col, Tooltip, Collapse } from 'antd'
import { DownOutlined, UpOutlined, InfoCircleOutlined } from '@ant-design/icons'

import { CSSProperties, useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import TrendingProjects from 'components/Projects/TrendingProjects'
import RankingExplanation from 'components/Projects/RankingExplanation'
import { Trans } from '@lingui/macro'
import CollapsePanel from 'antd/lib/collapse/CollapsePanel'

import { isMobile } from 'constants/styles/layouts'

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

  const arrowIconSize = 14

  const arrowIconStyle: CSSProperties = {
    fontSize: arrowIconSize,
    marginLeft: 5,
  }

  const dropdownSelectedBg = isDarkMode
    ? colors.background.l0
    : colors.background.brand.secondary

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
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: isDarkMode
                ? colors.background.l2
                : colors.background.l0,
            }}
          >
            <option
              className="select-item"
              style={
                trendingWindow === 7
                  ? { backgroundColor: dropdownSelectedBg }
                  : {}
              }
              onClick={() => setTrendingWindow(7)}
            >
              7 days
            </option>
            <option
              className="select-item"
              style={
                trendingWindow === 30
                  ? { backgroundColor: dropdownSelectedBg }
                  : {}
              }
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
            style={{ height: 550, marginTop: 46 }}
            src="/assets/green_orange.png"
            alt="Green orange singing"
          />
        </Col>
        <Col xs={24} lg={15}>
          <div style={{ paddingBottom: 20 }}>
            <h3 style={headingStyles}>
              {/* Only way I could get the title wrapping properly on mobile was making each word an element  
                  Also, used 'nbsp;' because{' '} doesn't work in Trans tag) */}
              <Trans>
                <span>Trending</span>&nbsp;<span>projects</span>&nbsp;
                <span>over</span>&nbsp;<span>the</span>&nbsp;<span>last</span>{' '}
                {trendingWindowSelect()}
                <Tooltip
                  title={<RankingExplanation trendingWindow={trendingWindow} />}
                  placement="bottom"
                >
                  <InfoCircleOutlined />
                </Tooltip>
              </Trans>
            </h3>
            <TrendingProjects
              count={6}
              trendingWindowDays={trendingWindow}
              isHomePage
            />
          </div>
        </Col>
      </Row>
    </section>
  )
}
