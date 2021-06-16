import { ThemeContext } from 'contexts/themeContext'
import { ModRef } from 'models/payment-mod'
import { useContext } from 'react'

export default function ModsShares({ shares }: { shares: ModRef[] }) {
  const {
    theme: { radii, colors },
  } = useContext(ThemeContext)

  const total = shares.reduce((acc, curr) => acc + (curr?.amount ?? 0), 0)

  const barHeight = 4

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          borderRadius: barHeight / 2,
        }}
      >
        {shares
          .sort((a, b) => (a?.amount ?? 0 < (b?.amount ?? 0) ? 1 : -1))
          .map(share => (
            <div
              key={share.address}
              style={{
                width: share?.amount ?? 0 / total + '%',
                height: barHeight,
              }}
            ></div>
          ))}
      </div>
    </div>
  )
}
