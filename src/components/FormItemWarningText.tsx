import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { PropsWithChildren } from 'react'

export default function FormItemWarningText({
  children,
  icon = <InformationCircleIcon className="inline h-4 w-4" />,
}: PropsWithChildren<{ icon?: JSX.Element }>) {
  return (
    <p className="text-warning-800 dark:text-warning-100">
      {icon} {children}
    </p>
  )
}
