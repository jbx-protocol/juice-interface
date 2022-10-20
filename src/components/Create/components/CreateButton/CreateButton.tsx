import { Button, ButtonProps } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const CreateButton: React.FC<ButtonProps> = props => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <Button
      {...props}
      type="dashed"
      style={{
        ...props.style,
        color: colors.text.action.primary,
        backgroundColor: isDarkMode
          ? '#004351'
          : colors.background.action.secondary,
      }}
    >
      {props.children}
    </Button>
  )
}
