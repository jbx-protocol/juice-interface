import { CheckCircleFilled } from '@ant-design/icons'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useMemo } from 'react'

export const CheckedCircle: React.FC<{
  checked: boolean
  defocused: boolean
}> = ({ checked, defocused }) => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)

  const borderColor = useMemo(() => {
    if (defocused) {
      return isDarkMode
        ? styleColors.darkColors.darkGray500
        : styleColors.lightColors.warmGray200
    }
    return isDarkMode
      ? styleColors.darkColors.darkGray300
      : styleColors.lightColors.warmGray300
  }, [defocused, isDarkMode])

  if (checked) {
    return (
      <CheckCircleFilled
        style={{ fontSize: '1.25rem', color: colors.background.action.primary }}
      />
    )
  }
  return (
    <div
      style={{
        height: '1.25rem',
        width: '1.25rem',
        borderRadius: '50%',
        border: `solid 1px ${borderColor}`,
        // backgroundColor: isDarkMode ? colors.background.l2 : undefined,
      }}
    />
  )
}
