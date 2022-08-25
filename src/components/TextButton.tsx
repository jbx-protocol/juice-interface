import { RightCircleOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export function TextButton({ style, ...props }: ButtonProps) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Button
      {...props}
      style={{
        color: colors.text.tertiary,
        textTransform: 'uppercase',
        padding: 0,
        ...style,
      }}
      className="text-xs"
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
