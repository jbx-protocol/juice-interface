import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import TooltipLabel from '../TooltipLabel'

export default function StatLine({
  statLabel,
  statLabelTip,
  statValue,
  style = {},
}: {
  statLabel: JSX.Element
  statLabelTip: JSX.Element
  statValue: JSX.Element
  style?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const secondaryTextStyle: CSSProperties = {
    textTransform: 'uppercase',
    color: colors.text.tertiary,
    fontSize: '0.8rem',
    fontWeight: 500,
  }

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
      <div style={secondaryTextStyle}>
        <TooltipLabel label={statLabel} tip={statLabelTip} />
      </div>

      <div
        style={{
          marginLeft: 10,
        }}
      >
        {statValue}
      </div>
    </div>
  )
}
