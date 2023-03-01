import { t } from '@lingui/macro'
import { Col, Tabs } from 'antd'
import Loading from 'components/Loading'
import { lazy, Suspense } from 'react'
import { COL_SIZE_MD } from '../V2V3Project'
const OverviewTab = lazy(() => import('./OverviewTab'))
const TokensTab = lazy(() => import('./TokensTab'))
const V2V3FundingCycleSection = lazy(() => import('../V2V3FundingCycleSection'))

export function ProjectPageTabs({ hasNftRewards }: { hasNftRewards: boolean }) {
  const tabItems = [
    {
      label: t`Overview`,
      key: 'overview',
      children: (
        <Suspense fallback={<Loading />}>
          <OverviewTab />
        </Suspense>
      ),
    },
    {
      label: t`Cycle`,
      key: 'cycle',
      children: (
        <Suspense fallback={<Loading />}>
          <section>
            <V2V3FundingCycleSection />
          </section>{' '}
        </Suspense>
      ),
    },
    {
      label: t`Tokens`,
      key: 'tokens',
      children: (
        <Suspense fallback={<Loading />}>
          <TokensTab hasNftRewards={hasNftRewards} />
        </Suspense>
      ),
    },
  ]

  return (
    <Col md={COL_SIZE_MD} xs={24}>
      <Tabs items={tabItems} />
    </Col>
  )
}
