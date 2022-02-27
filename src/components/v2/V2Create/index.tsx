import { NetworkName } from 'models/network-name'
import { Tabs } from 'antd'
import { useContext, useState } from 'react'

import V2UserProvider from 'providers/v2/UserProvider'

import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'

import { readNetwork } from 'constants/networks'
import V2WarningBanner from './V2WarningBanner'
import V2MainnetWarning from './V2MainnetWarning'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTabContent'
import FundingTabContent from './tabs/FundingTab/FundingTabContent'
import TokenTabContent from './tabs/TokenTab/TokenTabContent'
import RulesTabContent from './tabs/RulesTab/RulesTabContent'

const { TabPane } = Tabs

export default function V2Create() {
  const isMainnet = readNetwork.name === NetworkName.mainnet
  const { colors } = useContext(ThemeContext).theme
  const [activeTab, setActiveTab] = useState<string>('1')

  return (
    <V2UserProvider>
      <V2WarningBanner />
      <div style={{ margin: '4rem', marginBottom: 0 }}>
        <h1
          style={{
            marginBottom: '2rem',
            color: colors.text.primary,
            fontSize: 28,
          }}
        >
          <Trans>Design your project</Trans> 🎨
        </h1>

        {isMainnet && (
          <div style={{ padding: '1rem', textAlign: 'center' }}>
            <V2MainnetWarning />
          </div>
        )}

        {!isMainnet && (
          <div>
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarGutter={50}
              size="large"
            >
              <TabPane
                tab={<span style={{ fontSize: 18 }}>1. Project details</span>}
                key="1"
              >
                <ProjectDetailsTabContent
                  openNextTab={() => setActiveTab('2')}
                />
              </TabPane>
              <TabPane
                tab={<span style={{ fontSize: 18 }}>2. Funding</span>}
                key="2"
              >
                <FundingTabContent openNextTab={() => setActiveTab('3')} />
              </TabPane>
              <TabPane
                tab={<span style={{ fontSize: 18 }}>3. Token</span>}
                key="3"
              >
                <TokenTabContent openNextTab={() => setActiveTab('4')} />
              </TabPane>
              <TabPane
                tab={<span style={{ fontSize: 18 }}>4. Rules</span>}
                key="4"
              >
                <RulesTabContent />
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </V2UserProvider>
  )
}
