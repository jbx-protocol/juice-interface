import { Trans } from '@lingui/macro'
import { Button } from 'antd'

import { PlusCircleOutlined } from '@ant-design/icons'
import { twMerge } from 'tailwind-merge'

export function AddRewardTierButton({
  className,
  onClick,
  disabled,
}: {
  className?: string
  onClick: VoidFunction
  disabled?: boolean
}) {
  return (
    <Button
      className={twMerge('mt-4', className)}
      type="dashed"
      onClick={onClick}
      disabled={disabled}
      block
      size="large"
      icon={<PlusCircleOutlined />}
    >
      <span>
        <Trans>Add NFT</Trans>
      </span>
    </Button>
  )
}
