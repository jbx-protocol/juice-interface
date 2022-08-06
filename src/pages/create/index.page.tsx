import { Tabs } from 'antd'
import { useContext, useState } from 'react'
import { AppWrapper } from 'components/common'
import { V2UserProvider } from 'providers/v2/UserProvider'
import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { V2CurrencyProvider } from 'providers/v2/V2CurrencyProvider'
import { scrollToTop } from 'utils/windowUtils'

import ProjectDetailsTabContent from './tabs/ProjectDetailsTab/ProjectDetailsTabContent'
import FundingCycleTabContent from './tabs/FundingCycleTab/FundingCycleTabContent'
import { TabContentProps } from './models'
import ReviewDeployTab from './tabs/ReviewDeployTab'

export default function V2CreatePage() {
  return (
    <AppWrapper>
      <V2Create />
    </AppWrapper>
  )
}

const { TabPane } = Tabs

const TabText: React.FC = ({ children }) => {
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

function V2Create() {
  const { colors } = useContext(ThemeContext).theme
  const [activeTab, setActiveTab] = useState<string>('0')

  const isMobile = useMobile()

  return (
    <V2UserProvider>
      <V2CurrencyProvider>
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: !isMobile ? '2rem 4rem' : '2rem 1rem',
          }}
        >
          <h1
            style={{
              color: colors.text.primary,
              fontSize: 28,
            }}
          >
            <Trans>Launch your project</Trans>
          </h1>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarGutter={50}
            size="large"
          >
            {TABS.map((tab, idx) => (
              <TabPane tab={<TabText>{tab.title}</TabText>} key={idx}>
                <tab.component
                  onFinish={() => {
                    // bail if on last tab.
                    if (idx === TABS.length - 1) return

                    setActiveTab(`${idx + 1}`)
                    scrollToTop()
                  }}
                />
              </TabPane>
            ))}
          </Tabs>
        </div>
      </V2CurrencyProvider>
    </V2UserProvider>
  )
}
