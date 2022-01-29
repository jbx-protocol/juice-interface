import { Col, ColProps, Row, Space } from 'antd'
import { ChildElems } from 'models/child-elems'

export default function Grid({
  children,
  list,
}: {
  children: ChildElems
  list?: boolean
}) {
  const gutter = 20

  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: gutter },
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
            <Row gutter={gutter} key={i}>
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
