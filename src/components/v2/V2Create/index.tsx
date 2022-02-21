import { NetworkName } from 'models/network-name'
import { Tabs } from 'antd'

import V2UserProvider from 'providers/v2/UserProvider'

import { Trans } from '@lingui/macro'

import { readNetwork } from 'constants/networks'
import V2WarningBanner from './V2WarningBanner'
import V2MainnetWarning from './V2MainnetWarning'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTabContent'
import FundingTabContent from './tabs/FundingTabContent'
import DeployProjectButton from './DeployProjectButton'
import TokenTabContent from './tabs/TokenTabContent'
import RulesTabContent from './tabs/RulesTabContent'

const { TabPane } = Tabs

export default function V2Create() {
  const isMainnet = readNetwork.name === NetworkName.mainnet

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
            <Tabs tabBarExtraContent={{ right: <DeployProjectButton /> }}>
              <TabPane tab="1. Project details" key="1">
                <ProjectDetailsTabContent />
              </TabPane>
              <TabPane tab="2. Funding" key="2">
                <FundingTabContent />
              </TabPane>
              <TabPane tab="3. Token" key="3">
                <TokenTabContent />
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
