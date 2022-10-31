import { Button, ButtonProps } from 'antd'
import * as styleColors from 'constants/styles/colors'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const CreateButton: React.FC<ButtonProps> = props => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)

  // TODO: dark mode TBD
  const backgroundColor = isDarkMode ? undefined : styleColors.lightColors.hint
  return (
    <Button
      {...props}
      type="dashed"
      style={{
        ...props.style,
        color: colors.text.action.primary,
        borderColor: colors.text.action.primary,
        backgroundColor,
      }}
    >
      {props.children}
    </Button>
  )
}
