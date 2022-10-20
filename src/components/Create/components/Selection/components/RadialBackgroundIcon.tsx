import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { ReactNode, useContext, useMemo } from 'react'

export const RadialBackgroundIcon = ({
  icon,
  isDefocused,
}: {
  icon: ReactNode
  isDefocused: boolean
}) => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)

  const backgroundColor = useMemo(() => {
    if (isDarkMode) {
      // TODO: Nuanced color being used here
      return isDefocused ? colors.background.l1 : '#004351'
    }
    return isDefocused
      ? styleColors.lightColors.warmGray150
      : colors.background.action.secondary
  }, [
    colors.background.action.secondary,
    colors.background.l1,
    isDarkMode,
    isDefocused,
  ])
  const iconColor = useMemo(() => {
    if (isDarkMode) {
      return isDefocused ? colors.background.l2 : colors.text.action.primary
    }
    return isDefocused
      ? styleColors.lightColors.warmGray400
      : colors.text.action.primary
  }, [
    colors.background.l2,
    colors.text.action.primary,
    isDarkMode,
    isDefocused,
  ])

  return (
    <div
      style={{
        width: '2.625rem',
        height: '2.625rem',
        minWidth: '2.625rem',
        fontSize: '1.3rem',
        backgroundColor,
        color: iconColor,
        fill: iconColor,
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
    </div>
  )
}
