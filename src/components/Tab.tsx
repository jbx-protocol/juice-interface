import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export function Tab({
  name,
  isSelected,
  onClick,
}: {
  name: string
  isSelected: boolean
  href?: string
  onClick?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const className = [
    isSelected ? 'text-primary' : 'text-secondary',
    'hover-text-primary',
  ].join(' ')

  return (
    <span
      role="button"
      onClick={onClick}
      className={className}
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        paddingBottom: 6,
        fontWeight: 500,
        borderBottom: isSelected ? '2px solid ' + colors.text.primary : 'none',
      }}
    >
      {name}
    </span>
  )
}
