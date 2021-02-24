import { InfoCircleOutlined } from '@ant-design/icons'
import { Tooltip, TooltipProps } from 'antd'
import React from 'react'
import { colors } from '../constants/styles/colors'

export default function TooltipLabel({
  label,
  tip,
  placement,
}: {
  label: string
  tip?: string
  placement?: TooltipProps['placement']
}) {
  return (
    <span>
      <span style={{ marginRight: 5 }}>{label}</span>
      {tip ? (
        <Tooltip title={tip} placement={placement}>
          <InfoCircleOutlined style={{ color: colors.grape }} />
        </Tooltip>
      ) : null}
    </span>
  )
}
