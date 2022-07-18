import { Button, ButtonProps, Space } from 'antd'
import { RightCircleOutlined } from '@ant-design/icons'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

export function TextButton({ style, ...props }: ButtonProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Button
      {...props}
      style={{
        color: colors.text.tertiary,
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        padding: 0,
        ...style,
      }}
      type="text"
      size="small"
    >
      <Space size="small">
        {props.children}
        <RightCircleOutlined />
      </Space>
    </Button>
  )
}
