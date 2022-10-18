import { RightCircleOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Space } from 'antd'

export function TextButton({ style, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      style={{
        fontSize: '0.8rem',
        textTransform: 'uppercase',
        padding: 0,
        ...style,
      }}
      type="text"
      size="small"
      className="text-tertiary! hover-text-action-primary!"
    >
      <Space size="small">
        {props.children}
        <RightCircleOutlined />
      </Space>
    </Button>
  )
}
