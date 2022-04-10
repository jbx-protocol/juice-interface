import { Trans } from '@lingui/macro'
import { Col, Row } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

import ProjectPreview from './ProjectPreview'

const FULL_WIDTH_PX = 24

export default function ProjectConfigurationFieldsContainer({
  showPreview,
  previewContent,
  children,
}: PropsWithChildren<{ showPreview?: boolean; previewContent?: JSX.Element }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  if (!showPreview) return <>{children}</>

  return (
    <Row gutter={100} style={{ position: 'relative' }}>
      <Col md={12} xs={FULL_WIDTH_PX}>
        {children}
      </Col>
      <Col
        md={12}
        xs={FULL_WIDTH_PX}
        style={{
          position: 'sticky',
          top: 0,
          borderLeft: `1px solid ${colors.stroke.tertiary}`,
        }}
      >
        {previewContent ?? (
          <div>
            <h3
              style={{
                marginTop: 5,
                color: colors.text.secondary,
              }}
            >
              <Trans>Preview:</Trans>
            </h3>
            <ProjectPreview singleColumnLayout />
          </div>
        )}
      </Col>
    </Row>
  )
}
