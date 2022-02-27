import { CheckCircleFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import { Strategy } from 'constants/ballotStrategies/ballotStrategies'

// This component is either the selected option which opens the drawer of all options, or is an option within that drawer.
export default function ReconfigurationStrategyOption({
  title,
  content,
  index,
  strategy,
  selected,
  background,
  onSelectBallot,
}: {
  title: string
  content: JSX.Element
  index: number
  strategy: Strategy
  selected: boolean
  background?: string
  onSelectBallot: (strategy: Strategy) => void
}) {
  const { colors, radii } = useContext(ThemeContext).theme

  const cardStyles: CSSProperties = {
    display: 'flex',
    padding: '1rem',
    borderRadius: radii.md,
    cursor: 'pointer',
    ...(selected
      ? { border: '1px solid ' + colors.stroke.action.primary }
      : { border: '1px solid ' + colors.stroke.primary }),
    background: background ?? colors.background.l0,
  }

  return (
    <div
      key={index}
      className="clickable-border"
      style={cardStyles}
      onClick={() => onSelectBallot(strategy)}
    >
      <div
        style={{
          marginRight: 10,
          minWidth: 20,
          color: colors.text.action.primary,
        }}
      >
        {selected ? <CheckCircleFilled /> : null}
      </div>
      <div style={{ color: colors.text.primary }}>
        <h3
          style={{
            color: selected ? colors.text.action.primary : colors.text.primary,
          }}
        >
          {title}
        </h3>
        {content}
      </div>
    </div>
  )
}
