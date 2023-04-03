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
    <Button className={twMerge('h-8', className)} size="small">
      <BellFilled /> {text}
    </Button>
  )
}
