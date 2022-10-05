import { Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { ProjectPreview } from './ProjectPreview'

const FULL_WIDTH_PX = 24

export function ProjectConfigurationFieldsContainer({
  showPreview,
  children,
}: PropsWithChildren<{ showPreview?: boolean }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  if (!showPreview) return <>{children}</>

  return (
    <Row gutter={50}>
      <Col md={12} xs={FULL_WIDTH_PX}>
        {children}
      </Col>
      <Col md={12} xs={FULL_WIDTH_PX}>
        <h3
          style={{
            color: colors.text.secondary,
          }}
        >
          <Trans>Preview</Trans>
        </h3>

        <div
          style={{
            border: `1px solid ${colors.stroke.tertiary}`,
            padding: '1rem',
            overflow: 'hidden',
          }}
        >
          <ProjectPreview />
        </div>
      </Col>
    </Row>
  )
}
