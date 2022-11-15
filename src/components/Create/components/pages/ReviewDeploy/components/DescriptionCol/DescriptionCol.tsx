import { Col } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useContext } from 'react'
import { headerTextStyle } from '../styles'

export const DescriptionCol = ({
  title,
  desc,
  placeholder = '-',
  span,
  flex,
}: {
  title: ReactNode
  desc: ReactNode
  placeholder?: ReactNode
  span?: number | string
  flex?: number | 'none' | 'auto' | string
}) => {
  const { isDarkMode } = useContext(ThemeContext)
  return (
    <Col span={span} flex={flex}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={headerTextStyle(isDarkMode)}>{title}</div>
        <div>{desc ? desc : <i>{placeholder}</i>}</div>
      </div>
    </Col>
  )
}
