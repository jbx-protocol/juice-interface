import { RightCircleOutlined } from '@ant-design/icons'
import { Button, ButtonProps, Space } from 'antd'
import { classNames } from 'utils/classNames'

export function TextButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        'p-0 text-sm uppercase text-grey-400 hover:text-bluebs-400',
        className,
      )}
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
