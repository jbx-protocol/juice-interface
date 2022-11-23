import { WarningOutlined } from '@ant-design/icons'
import useMobile from 'hooks/Mobile'
import { classNames } from 'utils/classNames'
import { Callout } from './Callout'

export const WarningCallout: React.FC<{
  className?: string
  collapsible?: boolean
  iconSize?: 'small' | 'large'
}> = ({ className, collapsible, children }) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className={classNames(
        'border border-solid border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-900 dark:text-warning-100',
        className,
      )}
      iconComponent={<WarningOutlined className="text-2xl text-warning-500" />}
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
