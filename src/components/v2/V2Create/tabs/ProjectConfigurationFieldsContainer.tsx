import { Col } from 'antd'
import { PropsWithChildren } from 'react'

export default function ProjectConfigurationFieldsContainer({
  hidePreview,
  children,
}: PropsWithChildren<{ hidePreview?: boolean }>) {
  return (
    <Col md={!hidePreview ? 10 : 24} xs={24}>
      {children}
    </Col>
  )
}
