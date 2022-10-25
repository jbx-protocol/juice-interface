import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

export function ProjectVersionBadge({
  versionText,
  size,
  style,
}: {
  versionText: string
  size?: 'small'
  style?: CSSProperties
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <span
      style={{
        padding: size === 'small' ? '0 4px' : '2px 4px',
        background: colors.background.l2,
        color: colors.text.secondary,
        fontSize: size === 'small' ? '0.75rem' : 'auto',
        ...style,
      }}
    >
      {versionText}
    </span>
  )
}
