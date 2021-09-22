import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import { CSSProperties, useContext } from 'react'

export default function SectionHeader({
  text,
  tip,
  style,
}: {
  text: string | undefined
  tip?: string
  style?: CSSProperties
}) {
  const {
    forThemeOption,
    theme: { colors },
  } = useContext(ThemeContext)

  if (text === undefined) return null

  const _style: CSSProperties = {
    color: colors.text.header,
    fontWeight:
      forThemeOption &&
      forThemeOption({
        [ThemeOption.light]: 600,
        [ThemeOption.dark]: 400,
      }),
    ...style,
  }

  if (tip !== undefined) {
    return <TooltipLabel label={text} tip={tip} style={_style} />
  } else {
    return <h4 style={_style}>{text}</h4>
  }
}
