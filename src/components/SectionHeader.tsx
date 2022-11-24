import TooltipLabel from 'components/TooltipLabel'

import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function SectionHeader({
  text,
  tip,
  style,
}: {
  text: string | JSX.Element | undefined
  tip?: string | JSX.Element
  style?: CSSProperties
}) {
  const {
    forThemeOption,
    theme: { colors },
  } = useContext(ThemeContext)

  if (text === undefined) return null

  const _style: CSSProperties = {
    color: colors.text.header,
    fontWeight: forThemeOption?.({
      [ThemeOption.light]: 500,
      [ThemeOption.dark]: 400,
    }),
    fontSize: '0.875rem',
    ...style,
  }

  if (tip !== undefined) {
    return (
      <h2 style={_style}>
        <TooltipLabel label={text} tip={tip} />
      </h2>
    )
  } else {
    return <h2 style={_style}>{text}</h2>
  }
}
