import { ThemeContext } from 'contexts/themeContext'
import Link from 'next/link'
import { useContext } from 'react'

export function Tab({
  name,
  link,
  isSelected,
  onClick,
}: {
  name: string
  link: string
  isSelected: boolean
  onClick: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Link href={link} onClick={onClick}>
      <a
        style={{
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderBottom: '2px solid transparent',
          paddingBottom: 6,
          fontWeight: 500,
          ...(isSelected
            ? {
                color: colors.text.primary,
                borderColor: colors.text.primary,
              }
            : {
                color: colors.text.secondary,
                borderColor: 'transparent',
              }),
        }}
      >
        {name}
      </a>
    </Link>
  )
}
