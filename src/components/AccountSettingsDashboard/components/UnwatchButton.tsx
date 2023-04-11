import { BellFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'

export const UnwatchButton = ({
  className,
  text = t`Unwatch`,
  onClick,
  disabled,
}: {
  className?: string
  text?: string
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <Button
      disabled={disabled}
      icon={<BellFilled />}
      className={twMerge('h-8', className)}
      size="small"
      onClick={onClick}
    >
      <span className="hidden md:inline">{text}</span>
    </Button>
  )
}
