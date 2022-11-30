import { InfoCircleOutlined } from '@ant-design/icons'
import { PropsWithChildren } from 'react'

export default function FormItemWarningText({
  children,
  icon = <InfoCircleOutlined />,
}: PropsWithChildren<{ icon?: JSX.Element }>) {
  return (
    <p className="text-warning-800 dark:text-warning-100">
      {icon} {children}
    </p>
  )
}
