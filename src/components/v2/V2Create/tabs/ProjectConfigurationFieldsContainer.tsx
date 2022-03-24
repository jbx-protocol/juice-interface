import { Col } from 'antd'
import { ChildElems } from 'models/child-elems'

export default function ProjectConfigurationFieldsContainer({
  hidePreview,
  children,
}: {
  hidePreview?: boolean
  children?: ChildElems
}) {
  return (
    <Col md={!hidePreview ? 10 : 24} xs={24}>
      {children}
    </Col>
  )
}
