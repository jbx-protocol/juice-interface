import { Col, ColProps, Row, Space } from 'antd'
import { ChildElems } from 'models/child-elems'

const DEFAULT_GUTTER = 20

export default function Grid({
  children,
  list,
  gutter,
}: {
  children: ChildElems
  list?: boolean
  gutter?: number
}) {
  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter ?? DEFAULT_GUTTER },
  }

  if (!children) return null

  if (children && !Array.isArray(children)) return children

  return list ? (
    <Space style={{ width: '100%' }} direction="vertical">
      {children}
    </Space>
  ) : (
    <div>
      {children.map(
        (child, i) =>
          i % 2 === 0 && (
            <Row gutter={gutter ?? DEFAULT_GUTTER} key={i}>
              <Col {...colProps}>{child}</Col>
              {i + 1 < children.length && (
                <Col {...colProps}>{children[i + 1]}</Col>
              )}
            </Row>
          ),
      )}
    </div>
  )
}
