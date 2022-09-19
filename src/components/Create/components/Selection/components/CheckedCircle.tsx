import { CheckCircleFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export const CheckedCircle: React.FC<{ checked: boolean }> = ({ checked }) => {
  const {
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
        border: 'solid 1px',
        borderColor: colors.stroke.tertiary,
      }}
    />
  )
}
