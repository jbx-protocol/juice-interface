import { NetworkName } from 'models/network-name'
import { Tabs } from 'antd'
import { PropsWithChildren, useContext, useState } from 'react'

import V2UserProvider from 'providers/v2/UserProvider'

import { t, Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

import { readNetwork } from 'constants/networks'
import V2WarningBanner from './V2WarningBanner'
import V2MainnetWarning from './V2MainnetWarning'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTabContent'
import FundingTabContent from './tabs/FundingTab/FundingTabContent'
import TokenTabContent from './tabs/TokenTab/TokenTabContent'
import RulesTabContent from './tabs/RulesTab/RulesTabContent'
import { TabContentProps } from './models'

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
    title: t`2. Funding`,
    component: FundingTabContent,
  },
  {
    title: t`3. Token`,
    component: TokenTabContent,
  },
  {
    title: t`4. Rules`,
    component: RulesTabContent,
  },
]

export default function V2Create() {
  const isRinkeby = readNetwork.name === NetworkName.rinkeby
  const { colors } = useContext(ThemeContext).theme
  const [activeTab, setActiveTab] = useState<string>('0')

  return (
    <V2UserProvider>
      {isRinkeby ? <V2WarningBanner /> : null}
      <div style={{ margin: '4rem', marginBottom: 0 }}>
        {!isRinkeby && (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <V2MainnetWarning />
          </div>
        )}

        {isRinkeby && (
          <div>
            <h1
              style={{
                marginBottom: '2rem',
                color: colors.text.primary,
                fontSize: 28,
              }}
            >
              <Trans>Design your project</Trans> 🎨
            </h1>

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
        )}
      </div>
    </V2UserProvider>
  )
}
