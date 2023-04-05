import { WarningOutlined } from '@ant-design/icons'
import useMobile from 'hooks/Mobile'
import { twJoin, twMerge } from 'tailwind-merge'
import { Callout } from './Callout'

export const WarningCallout: React.FC<{
  className?: string
  collapsible?: boolean
  iconSize?: 'small' | 'large'
}> = ({ className, collapsible, children, iconSize }) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className={twMerge(
        'rounded-lg border border-solid border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-950 dark:text-warning-100',
        className,
      )}
      iconComponent={
        <WarningOutlined
          className={twJoin(
            'flex text-warning-500',
            iconSize === 'small' ? 'text-lg' : 'text-2xl',
          )}
        />
      }
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
