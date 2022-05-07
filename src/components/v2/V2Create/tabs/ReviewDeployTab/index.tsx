import { Trans } from '@lingui/macro'
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
      <h1 style={{ fontSize: '1.3rem' }}>
        <Trans>Review project configuration</Trans>
      </h1>
      <div
        style={{
          marginBottom: '2rem',
          marginTop: '4rem',
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
