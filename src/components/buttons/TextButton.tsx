import { RightCircleOutlined } from '@ant-design/icons'
import { Button, ButtonProps } from 'antd'
import { classNames } from 'utils/classNames'

export function TextButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      {...props}
      className={classNames(
        'p-0 text-sm uppercase text-grey-400 hover:text-bluebs-500',
        className,
      )}
      type="text"
      size="small"
    >
      <div className="flex items-center gap-2">
        {props.children}
        <RightCircleOutlined />
      </div>
    </Button>
  )
}
