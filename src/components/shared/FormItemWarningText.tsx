import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'
import { QuestionCircleOutlined } from '@ant-design/icons'

export default function FormItemWarningText({
  children,
  icon = <QuestionCircleOutlined />,
}: PropsWithChildren<{ icon?: JSX.Element }>) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <p style={{ color: colors.text.warn }}>
      {icon} {children}
    </p>
  )
}
