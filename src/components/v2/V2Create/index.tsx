import { Tabs } from 'antd'
import { PropsWithChildren, useContext, useState } from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'

import V2UserProvider from 'providers/v2/UserProvider'

import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

import V2CurrencyProvider from 'providers/v2/V2CurrencyProvider'

import ExternalLink from 'components/shared/ExternalLink'

import ProjectDetailsTabContent from './tabs/ProjectDetailsTab/ProjectDetailsTabContent'
import FundingCycleTabContent from './tabs/FundingCycleTab/FundingCycleTabContent'
import { TabContentProps } from './models'
import ReviewDeployTab from './tabs/ReviewDeployTab'

const { TabPane } = Tabs

const TabText = ({ children }: PropsWithChildren<{}>) => {
  return <span style={{ fontSize: 18 }}>{children}</span>
}

type TabConfig = {
  title: string
  component: ({ onFinish }: TabContentProps) => JSX.Element
}

const TABS: TabConfig[] = [
  {
    title: t`1. Project details`,
    component: ProjectDetailsTabContent,
  },
  {
    title: t`2. Funding cycle`,
    component: FundingCycleTabContent,
  },
  {
    title: t`3. Review and deploy`,
    component: ReviewDeployTab,
  },
]

export default function V2Create() {
  const { colors } = useContext(ThemeContext).theme
  const [activeTab, setActiveTab] = useState<string>('0')

  return (
    <V2UserProvider>
      <V2CurrencyProvider>
        <div
          style={{
            maxWidth: 1300,
            margin: '0 auto',
            padding: '2rem 4rem',
          }}
        >
          <div>
            <h1
              style={{
                color: colors.text.primary,
                fontSize: 28,
              }}
            >
              <Trans>Design your project</Trans> 🎨
            </h1>

            <p>
              <InfoCircleOutlined />{' '}
              <Trans>
                Your project will be created on the Juicebox V2 protocol.{' '}
                <ExternalLink href="https://info.juicebox.money/docs/build/project-design">
                  Learn more.
                </ExternalLink>
              </Trans>
            </p>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarGutter={50}
              size="large"
            >
              {TABS.map((tab, idx) => (
                <TabPane tab={<TabText>{tab.title}</TabText>} key={`${idx}`}>
                  <tab.component
                    onFinish={() => {
                      // bail if on last tab.
                      if (idx === TABS.length - 1) return

                      setActiveTab(`${idx + 1}`)
                      window.scrollTo(0, 0)
                    }}
                  />
                </TabPane>
              ))}
            </Tabs>
          </div>
        </div>
      </V2CurrencyProvider>
    </V2UserProvider>
  )
}
