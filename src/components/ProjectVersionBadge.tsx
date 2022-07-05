import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function ProjectVersionBadge({
  versionText,
  size,
}: {
  versionText: string
  size?: 'small'
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <span
      style={{
        padding: size === 'small' ? '0 2px' : '2px 4px',
        background: colors.background.l1,
        color: colors.text.tertiary,
        fontSize: size === 'small' ? '0.7rem' : 'auto',
      }}
    >
      {versionText}
    </span>
  )
}
