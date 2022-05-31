import { Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import useMobile from 'hooks/Mobile'

import DeployProjectButton from './DeployProjectButton'
import ProjectDetailsSection from './ProjectDetailsSection'
import FundingSummarySection from './FundingSummarySection'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
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
        </Space>
      </div>

      <DeployProjectButton />
    </div>
  )
}
