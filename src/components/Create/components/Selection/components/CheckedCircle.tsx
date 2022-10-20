import { CheckCircleFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const CheckedCircle: React.FC<{ checked: boolean }> = ({ checked }) => {
  const {
    isDarkMode,
    theme: { colors },
  } = useContext(ThemeContext)
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
        border: isDarkMode ? undefined : `solid 1px ${colors.stroke.tertiary}`,
        backgroundColor: isDarkMode ? colors.background.l2 : undefined,
      }}
    />
  )
}
