import ProjectHandle from 'components/shared/ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'
import { ModRef } from 'models/mods'
import { useContext } from 'react'
import { fromPerbicent } from 'utils/formatNumber'

export default function Mods({ mods }: { mods: ModRef[] | undefined }) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <div>
      {mods?.length ? (
        mods.map(m => (
          <div
            key={m.beneficiary}
            style={{
              display: 'flex',
              alignItems: 'baseline',
            }}
          >
            <span style={{ width: 70 }}>{fromPerbicent(m.percent)}%:</span>
            <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>
              {m.projectId ? (
                <span>
                  @<ProjectHandle projectId={m.projectId} />
                </span>
              ) : (
                m.beneficiary
              )}
            </span>
          </div>
        ))
      ) : (
        <span style={{ color: colors.text.secondary }}>No wallets</span>
      )}
    </div>
  )
}
