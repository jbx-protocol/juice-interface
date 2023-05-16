import { InformationCircleIcon } from '@heroicons/react/24/outline'
import useMobile from 'hooks/useMobile'
import { twMerge } from 'tailwind-merge'
import { Callout } from './Callout'

export const InfoCallout: React.FC<
  React.PropsWithChildren<{
    className?: string
    noIcon?: boolean
    icon?: JSX.Element
    collapsible?: boolean
    transparent?: boolean
  }>
> = ({
  className,
  children,
  noIcon = false,
  icon,
  transparent = false,
  collapsible,
}) => {
  const isMobile = useMobile()
  const collapse = collapsible ?? isMobile
  return (
    <Callout
      className={twMerge(
        !transparent ? 'bg-smoke-75 dark:bg-slate-400' : undefined,
        className,
        'rounded-lg',
      )}
      iconComponent={
        !noIcon ? icon ?? <InformationCircleIcon className="h-7 w-7" /> : null
      }
      collapsible={collapse}
    >
      <div className="mt-0.5">{children}</div>
    </Callout>
  )
}
