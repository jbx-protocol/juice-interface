import { Space, Statistic } from 'antd'
import React from 'react'

export default function ConfirmIssueTickets({
  name,
  symbol,
}: {
  name: string | undefined
  symbol: string | undefined
}) {
  return (
    <div>
      <h1 style={{ fontSize: '2rem' }}>Review your tickets</h1>
      <div
        style={{
          marginTop: 20,
          marginBottom: 20,
        }}
      >
        <Space direction="vertical" size="large">
          <Statistic title="Name" value={name + ' Juice tickets'} />
          <Statistic title="Symbol" value={'j' + symbol} />
        </Space>
      </div>
    </div>
  )
}
