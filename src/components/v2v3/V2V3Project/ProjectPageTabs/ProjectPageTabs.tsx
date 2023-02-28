import { t } from '@lingui/macro'
import { Col, Tabs } from 'antd'
import { V2V3FundingCycleSection } from '../V2V3FundingCycleSection'
import { COL_SIZE_MD } from '../V2V3Project'
import { OverviewTab } from './OverviewTab'
import { TokensTab } from './TokensTab'

export function ProjectPageTabs({ hasNftRewards }: { hasNftRewards: boolean }) {
  const tabItems = [
    {
      label: t`Overview`,
      key: 'overview',
      children: <OverviewTab />,
    },
    {
      label: t`Cycle`,
      key: 'cycle',
      children: (
        <section>
          <V2V3FundingCycleSection />
        </section>
      ),
    },
    {
      label: t`Tokens`,
      key: 'tokens',
      children: <TokensTab hasNftRewards={hasNftRewards} />,
    },
  ]

  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <Tabs items={tabItems} />
    </Col>
  )
}
