import { ThemeContext } from 'contexts/themeContext'
import { ModRef } from 'models/mods'
import { useContext } from 'react'
import { parsePerbicent } from 'utils/formatNumber'

export default function ModsShares({ mods }: { mods: ModRef[] }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const total = mods.reduce(
    (acc, curr) =>
      acc + parsePerbicent(curr?.percent.toString() ?? '0').toNumber(),
    0,
  )

  const barHeight = 4

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'end',
          paddingTop: 10,
          paddingBottom: 10,
        }}
      >
        {mods.map(mod => (
          <div
            key={mod.beneficiary}
            style={{
              width: (mod?.percent ?? 0 / total) + '%',
              height: barHeight,
              background: colors.background.brand.primary,
              borderRadius: barHeight / 2,
            }}
          ></div>
        ))}
      </div>
    </div>
  )
}
