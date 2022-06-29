import { Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import useMobile from 'hooks/Mobile'
import { useAppSelector } from 'hooks/AppSelector'

import DeployProjectButton from './DeployProjectButton'
import ProjectDetailsSection from './ProjectDetailsSection'
import FundingSummarySection from './FundingSummarySection'
import NFTSummarySection from './NFTSummarySection'
import { StartOverButton } from '../../StartOverButton'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)

  const isMobile = useMobile()
  return (
    <div style={isMobile ? { padding: '0 1rem' } : {}}>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <Space size="large" direction="vertical" style={{ width: '100%' }}>
          <ProjectDetailsSection />
          <FundingSummarySection />
          {nftRewardTiers.length ? <NFTSummarySection /> : null}
        </Space>
      </div>

      <DeployProjectButton />
      <StartOverButton />
    </div>
  )
}
