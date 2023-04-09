import { BellFilled } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'

export const UnwatchButton = ({
  className,
  text = t`Unwatch`,
}: {
  className?: string
  text?: string
}) => {
  return (
    <Button
      icon={<BellFilled />}
      className={twMerge('h-8', className)}
      size="small"
    >
      <span className="hidden md:inline">{text}</span>
    </Button>
  )
}
