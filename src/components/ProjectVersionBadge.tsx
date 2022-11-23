import { classNames } from 'utils/classNames'

export function ProjectVersionBadge({
  className,
  transparent = false,
  versionText,
  size,
}: {
  className?: string
  transparent?: boolean
  versionText: string
  size?: 'small'
}) {
  return (
    <span
      className={classNames(
        'cursor-default text-grey-900 dark:text-slate-100',
        !transparent ? 'bg-smoke-75 dark:bg-slate-400' : '',
        size === 'small' ? 'py-0 px-1 text-xs' : 'py-0.5 px-1 text-sm',
        className,
      )}
    >
      {versionText}
    </span>
  )
}
