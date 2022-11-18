import { t, Trans } from '@lingui/macro'
import { Tabs } from 'antd'
import { AppWrapper, Head } from 'components/common'
import { Create } from 'components/Create'
import { CV_V3 } from 'constants/cv'
import { LAYOUT_MAX_WIDTH_PX } from 'constants/styles/layouts'
import { ThemeContext } from 'contexts/themeContext'
import useMobile from 'hooks/Mobile'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'providers/v2v3/V2V3CurrencyProvider'
import { useContext, useState } from 'react'
import { scrollToTop } from 'utils/windowUtils'
import { TabContentProps } from './models'
import FundingCycleTabContent from './tabs/FundingCycleTab/FundingCycleTabContent'
import ProjectDetailsTabContent from './tabs/ProjectDetailsTab/ProjectDetailsTabContent'
import ReviewDeployTab from './tabs/ReviewDeployTab'

export default function V2CreatePage() {
  return (
    <>
      <Head
        title={t`Create a project`}
        url={process.env.NEXT_PUBLIC_BASE_URL + '/create'}
        description={t`Create a project on Juicebox`}
      />

      <AppWrapper>
        <Create />
      </AppWrapper>
    </>
  )
}

type TabConfig = {
  label: string
  component: ({ onFinish }: TabContentProps) => JSX.Element
}

const TABS: TabConfig[] = [
  {
    label: t`1. Project details`,
    component: ProjectDetailsTabContent,
  },
  {
    label: t`2. Funding cycle`,
    component: FundingCycleTabContent,
  },
  {
    label: t`3. Review and deploy`,
    component: ReviewDeployTab,
  },
]

// TODO: Delete this and other related code after we're sure new create page is working.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function V2Create() {
  const { colors } = useContext(ThemeContext).theme
  const [activeTab, setActiveTab] = useState<string>('0')

  const isMobile = useMobile()

  const TAB_ITEMS = TABS.map((tab, idx) => {
    return {
      label: tab.label,
      key: idx.toString(),
      children: (
        <tab.component
          onFinish={() => {
            // bail if on last tab.
            if (idx === TABS.length - 1) return

            setActiveTab(`${idx + 1}`)
            scrollToTop()
          }}
        />
      ),
    }
  })

  return (
    // New projects will be launched using V3 contracts.
    <V2V3ContractsProvider initialCv={CV_V3}>
      <TransactionProvider>
        <V2V3CurrencyProvider>
          <div
            style={{
              maxWidth: LAYOUT_MAX_WIDTH_PX,
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
              <Trans>Create a project</Trans>
            </h1>

            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              tabBarGutter={50}
              size="large"
              items={TAB_ITEMS}
            />
          </div>
        </V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )
}
