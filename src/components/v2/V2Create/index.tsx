import { NetworkName } from 'models/network-name'
import { Tabs } from 'antd'
import { useState } from 'react'

import V2UserProvider from 'providers/v2/UserProvider'

import { Trans } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import V2WarningBanner from './V2WarningBanner'
import V2MainnetWarning from './V2MainnetWarning'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTabContent'
import FundingTabContent from './tabs/FundingTabContent'
import DeployProjectButton from './DeployProjectButton'
import TokenTabContent from './tabs/TokenTab/TokenTabContent'
import RulesTabContent from './tabs/RulesTabContent'

const { TabPane } = Tabs

export const floatingSaveContainerHeight = 60
export const formBottomMargin = floatingSaveContainerHeight + 20

export default function V2Create() {
  const isMainnet = readNetwork.name === NetworkName.mainnet

  const [activeTab, setActiveTab] = useState<string>('1')

  return (
    <V2UserProvider>
      <V2WarningBanner />
      <div style={{ margin: '4rem', marginBottom: 0 }}>
        <h1>
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
              tabBarExtraContent={{ right: <DeployProjectButton /> }}
              onChange={setActiveTab}
            >
              <TabPane tab="1. Project details" key="1">
                <ProjectDetailsTabContent
                  openNextTab={() => setActiveTab('2')}
                />
              </TabPane>
              <TabPane tab="2. Funding" key="2">
                <FundingTabContent openNextTab={() => setActiveTab('3')} />
              </TabPane>
              <TabPane tab="3. Token" key="3">
                <TokenTabContent openNextTab={() => setActiveTab('4')} />
              </TabPane>
              <TabPane tab="4. Rules" key="4">
                <RulesTabContent />
              </TabPane>
            </Tabs>
          </div>
        )}
      </div>
    </V2UserProvider>
  )
}
