import { Trans } from '@lingui/macro'

import { useContext } from 'react'

import { ThemeContext } from 'contexts/themeContext'

import DeployProjectButton from './DeployProjectButton'
import ProjectPreview from '../../ProjectPreview'

export default function ReviewDeployTab() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem' }}>
        <Trans>Review project configuration</Trans>
      </h1>
      <div
        style={{
          padding: '3rem',
          border: '1px solid' + colors.stroke.tertiary,
          marginBottom: '2rem',
        }}
      >
        <ProjectPreview />
      </div>

      <DeployProjectButton />
    </div>
  )
}
