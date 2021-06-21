import ProjectHandle from 'components/shared/ProjectHandle'
import { ThemeContext } from 'contexts/themeContext'
import { ModRef } from 'models/mods'
import { useContext } from 'react'
import { fromPerbicent } from 'utils/formatNumber'
import { BigNumber } from 'ethers'
import ShortAddress from 'components/shared/ShortAddress'

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
            <span style={{ minWidth: 70 }}>{fromPerbicent(m.percent)}%:</span>
            <span style={{ fontWeight: 500, fontSize: '0.8rem' }}>
              {m.projectId && BigNumber.from(m.projectId).gt(0) ? (
                <span>
                  <div>
                    @<ProjectHandle projectId={m.projectId} /> (Beneficiary:{' '}
                    <ShortAddress address={m.beneficiary} />)
                  </div>
                </span>
              ) : (
                <ShortAddress address={m.beneficiary} />
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
