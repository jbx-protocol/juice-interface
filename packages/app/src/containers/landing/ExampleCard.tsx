import React from 'react'

import { colors } from '../../constants/styles/colors'
import { shadowCard } from '../../constants/styles/shadow-card'

export default function ExampleCard({
  title,
  duration,
  timeLeft,
  target,
  earned,
  tokenName,
  ticketName,
}: {
  title: string
  duration: number
  timeLeft: number
  target: number
  earned: number
  tokenName: string
  ticketName?: string
}) {
  const surplus = earned - target

  const padding = 20

  const want = 'DAI'

  const info = (
    label: string,
    value: string,
    suffix?: string,
    highlight?: boolean,
  ) => (
    <div>
      <div style={{ fontWeight: 600 }}>{label}</div>
      <div style={highlight ? { fontWeight: 600, color: 'orange' } : {}}>
        {value}
        {suffix ? (
          <span style={{ color: colors.secondary, marginLeft: 5 }}>
            ({suffix})
          </span>
        ) : null}{' '}
      </div>
    </div>
  )

  return (
    <div
      style={{
        ...shadowCard,
        display: 'inline-block',
        marginRight: 40,
        width: 360,
        minWidth: 360,
      }}
    >
      <div style={{ padding, fontWeight: 600, fontSize: 20 }}>{title}</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding,
          rowGap: 10,
        }}
      >
        {info('Duration', duration + ' days')}
        {info(
          'Time left',
          timeLeft + (timeLeft > 1 ? ' days' : ' day'),
          undefined,
          timeLeft <= 1,
        )}
        {info('Target', target + ' ' + want)}
        {info(
          'Total earned',
          earned + ' ' + want,
          surplus ? '+' + surplus : undefined,
        )}
      </div>
      <div style={{ padding, color: colors.secondary }}>
        {surplus} {want} will be swapped for {tokenName} and redistributed to t
        {ticketName ?? tokenName} holders.
      </div>
    </div>
  )
}
