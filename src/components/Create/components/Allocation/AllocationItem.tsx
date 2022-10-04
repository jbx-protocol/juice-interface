import { Col, Row, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useContext } from 'react'

export const AllocationItem = ({
  title,
  amount,
  extra,
  onClick,
}: {
  title: ReactNode
  amount: ReactNode
  extra?: ReactNode
  onClick?: VoidFunction
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const isClickable = !!onClick

  return (
    <Row
      className={isClickable ? 'clickable-border' : 'border'}
      style={{
        backgroundColor: colors.background.l2,
        userSelect: 'none',
        cursor: isClickable ? 'pointer' : undefined,
      }}
      onClick={onClick}
    >
      <Col
        span={13}
        style={{
          padding: '0.75rem 0 0.75rem 1.75rem',
          borderRight: '1px solid',
          borderColor: colors.stroke.tertiary,
        }}
      >
        {title}
      </Col>
      <Col
        span={11}
        style={{
          padding: '0.75rem 1rem 0.75rem 0',
          textAlign: 'end',
        }}
      >
        <Space size="large">
          {amount}
          {extra}
        </Space>
      </Col>
    </Row>
  )
}
