import { t, Trans } from '@lingui/macro'
import { Tabs } from 'antd'
import { AppWrapper } from 'components/common'
import { DesmosScript } from 'components/common/Head/scripts/DesmosScript'
import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import Head from 'next/head'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'providers/v2v3/V2V3CurrencyProvider'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { scrollToTop } from 'utils/windowUtils'

import { TabContentProps } from './models'
import FundingCycleTabContent from './tabs/FundingCycleTab/FundingCycleTabContent'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTab/ProjectDetailsTabContent'
import ReviewDeployTab from './tabs/ReviewDeployTab'

export default function V2CreatePage() {
  return (
    <>
      <Head>
        <DesmosScript />
      </Head>

      <AppWrapper>
        <V2Create />
      </AppWrapper>
    </>
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
    <V2V3ContractsProvider
      initialCv={featureFlagEnabled(FEATURE_FLAGS.V3) ? CV_V3 : CV_V2}
    >
      <TransactionProvider>
        <V2V3CurrencyProvider>
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
        </V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )
}
