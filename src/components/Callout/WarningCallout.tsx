import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'
import useMobile from 'hooks/useMobile'
import { twJoin, twMerge } from 'tailwind-merge'
import { Callout } from './Callout'

export const WarningCallout: React.FC<
  React.PropsWithChildren<{
    className?: string
    collapsible?: boolean
    iconSize?: 'small' | 'large'
  }>
> = ({ className, collapsible, children, iconSize }) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className={twMerge(
        'rounded-lg border border-warning-200 bg-warning-50 text-warning-800 dark:border-warning-500 dark:bg-warning-950 dark:text-warning-100',
        className,
      )}
      iconComponent={
        <ExclamationTriangleIcon
          className={twJoin(
            'flex text-warning-500',
            iconSize === 'small' ? 'h-4 w-4' : 'h-6 w-6',
          )}
        />
      }
      collapsible={collapse}
    >
      {children}
    </Callout>
  )
}
