import { Trans } from '@lingui/macro'

import { useContext } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import { Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import useMobile from 'hooks/Mobile'

import DeployProjectButton from './DeployProjectButton'
import ProjectDetailsSection from './ProjectDetailsSection'
import FundingSection from './FundingSection'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const isMobile = useMobile()
  return (
    <div>
      <h1 style={{ fontSize: !isMobile ? '1.5rem' : '1.3rem' }}>
        <Trans>Review project configuration</Trans>
      </h1>
      <div
        style={{
          padding: !isMobile ? '3rem' : '2rem',
          border: '1px solid' + colors.stroke.tertiary,
          marginBottom: '2rem',
        }}
      >
        <Space size="large" direction="vertical">
          <ProjectDetailsSection />
          <FundingSection />
        </Space>
      </div>

      <DeployProjectButton />
    </div>
  )
}
