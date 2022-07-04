import { Skeleton } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import { textSecondary } from 'constants/styles/text'

import TooltipLabel from '../TooltipLabel'

export default function StatLine({
  statLabel,
  statLabelTip,
  statValue,
  style = {},
  loading = false,
}: {
  statLabel: JSX.Element
  statLabelTip: JSX.Element
  statValue: JSX.Element
  style?: CSSProperties
  loading?: boolean
}) {
  const { theme } = useContext(ThemeContext)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        flexWrap: 'nowrap',
        ...style,
      }}
    >
      <div style={textSecondary(theme)}>
        <TooltipLabel label={statLabel} tip={statLabelTip} />
      </div>

      {loading ? (
        <div style={{ width: 60, height: 16 }}>
          <Skeleton
            paragraph={{ rows: 1, width: '100%' }}
            title={false}
            active
          />
        </div>
      ) : (
        <div
          style={{
            marginLeft: 10,
          }}
        >
          {statValue}
        </div>
      )}
    </div>
  )
}
