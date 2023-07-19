import { twMerge } from 'tailwind-merge'

/**
 * Render an icon with a number badge.
 * @param icon Icon to render.
 * @param className className of container.
 * @param badgeNumber Number to display in badge. If undefined, no badge is rendered.
 * @param badgeClassName className of number badge.
 * @returns
 */
export default function BadgeIcon({
  icon,
  className,
  badgeNumber,
  badgeClassName,
}: {
  icon: JSX.Element
  className?: string
  badgeNumber?: number
  badgeClassName?: string
}) {
  return (
    <div className={twMerge('relative inline-block', className)}>
      {icon}
      {badgeNumber !== undefined && (
        <div
          className={twMerge(
            'absolute -bottom-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-xs font-bold text-grey-600 dark:text-grey-400',
            badgeClassName,
          )}
        >
          {badgeNumber}
        </div>
      )}
    </div>
  )
}
