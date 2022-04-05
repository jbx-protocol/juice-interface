import { Col, Row } from 'antd'
import { PropsWithChildren } from 'react'

import ProjectPreview from '../ProjectPreview'

const FULL_WIDTH_PX = 24

export default function ProjectConfigurationFieldsContainer({
  showPreview,
  previewContent,
  children,
}: PropsWithChildren<{ showPreview?: boolean; previewContent?: JSX.Element }>) {
  if (!showPreview) return <>{children}</>

  return (
    <Row gutter={40}>
      <Col md={12} xs={FULL_WIDTH_PX}>
        {children}
      </Col>
      <Col md={12} xs={FULL_WIDTH_PX}>
        {previewContent ?? <ProjectPreview />}
      </Col>
    </Row>
  )
}
