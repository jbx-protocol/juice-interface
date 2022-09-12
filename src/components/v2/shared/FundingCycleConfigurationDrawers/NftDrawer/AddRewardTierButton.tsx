import { Trans } from '@lingui/macro'
import { Button } from 'antd'

import { PlusCircleOutlined } from '@ant-design/icons'
import { CSSProperties } from 'react'

export function AddRewardTierButton({
  onClick,
  disabled,
  style,
}: {
  onClick: VoidFunction
  disabled?: boolean
  style?: CSSProperties
}) {
  const buttonStyle: CSSProperties = {
    ...style,
    marginTop: 15,
  }

  return (
    <Button
      type="dashed"
      onClick={onClick}
      style={buttonStyle}
      disabled={disabled}
      block
      size="large"
      icon={<PlusCircleOutlined />}
    >
      <span>
        <Trans>Add reward tier</Trans>
      </span>
    </Button>
  )
}
