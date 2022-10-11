import { Col } from 'antd'
import { ReactNode } from 'react'
import { headerTextStyle } from '../styles'

export const DescriptionCol = ({
  title,
  desc,
  optional = '-',
  span,
  flex,
}: {
  title: ReactNode
  desc: ReactNode
  optional?: ReactNode
  span?: number | string
  flex?: number | 'none' | 'auto' | string
}) => {
  return (
    <Col span={span} flex={flex}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={headerTextStyle}>{title}</div>
        <div>{desc ? desc : <i>{optional}</i>}</div>
      </div>
    </Col>
  )
}
