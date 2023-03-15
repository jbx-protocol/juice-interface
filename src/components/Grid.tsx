import { Col, ColProps, Row, Space } from 'antd'
import { PropsWithChildren } from 'react'
import { isReactNodeArray } from 'utils/isReactNodeArray'

const DEFAULT_GUTTER = 20

export default function Grid({
  children,
  list,
  gutter,
}: PropsWithChildren<{
  list?: boolean
  gutter?: number
}>) {
  const _gutter = gutter ?? DEFAULT_GUTTER
  const colProps: ColProps = {
    xs: 24,
    md: 12,
    style: { marginBottom: _gutter },
  }

  if (!children) return <></>
  if (!isReactNodeArray(children)) return <>{children}</>

  return list ? (
    <Space className="w-full" direction="vertical" size={_gutter}>
      {children}
    </Space>
  ) : (
    <div>
      {children.map(
        (child, i) =>
          i % 2 === 0 && (
            <Row gutter={_gutter} key={i}>
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
