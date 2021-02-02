import { Tooltip } from 'antd'
import React from 'react'

export default function Wallet({
  providerAddress,
}: {
  providerAddress?: string
}) {
  const shortened =
    providerAddress?.substring(0, 6) +
    '...' +
    providerAddress?.substr(providerAddress.length - 6, 6)

  return providerAddress ? (
    <span
      style={{
        height: 30,
        borderRadius: 15,
        padding: '0px 10px',
        display: 'flex',
        alignItems: 'center',
        background: '#5AC3D166',
        cursor: 'default',
        userSelect: 'all',
      }}
    >
      <Tooltip title={providerAddress}>{shortened}</Tooltip>
    </span>
  ) : null
}
