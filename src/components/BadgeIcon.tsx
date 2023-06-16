import { classNames } from 'utils/classNames'

export default function BadgeIcon({
  icon,
  className,
  badgeClassName,
  badgeCount,
}: {
  icon: JSX.Element
  className?: string
  badgeClassName?: string
  badgeCount?: number
}) {
  return (
    <div className={classNames('relative inline-block', className)}>
      {icon}
      <div
        className={classNames(
          'absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-grey-600 dark:text-grey-400',
          badgeClassName,
        )}
      >
        {badgeCount ?? null}
      </div>
    </div>
  )
}
