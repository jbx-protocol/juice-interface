import { InfoCircleOutlined } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { PropsWithChildren, useContext } from 'react'

export default function FormItemWarningText({
  children,
  icon = <InfoCircleOutlined />,
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
