import { XMarkIcon } from '@heroicons/react/24/solid'
import { ProjectTagName } from 'models/project-tags'
import { twMerge } from 'tailwind-merge'

/**
 * Formatted project tag.
 */
export function ProjectTag({
  tag,
  className,
  selected,
  onClick,
  clickable,
  disabled,
}: {
  tag: ProjectTagName
  className?: string
  selected?: boolean
  onClick?: (tag: ProjectTagName) => void
  clickable?: boolean
  disabled?: boolean
}) {
  const isClickable = Boolean(!disabled && onClick) || clickable

  return (
    <div
      onClick={isClickable ? () => onClick?.(tag) : undefined}
      className={twMerge(
        'flex items-center gap-1 rounded-full border border-solid border-smoke-200 py-1 px-3 text-sm font-medium uppercase text-smoke-600 transition-colors dark:border-slate-400 dark:text-slate-200',
        selected
          ? 'bg-smoke-200 font-medium text-smoke-800 dark:bg-slate-600 dark:text-slate-100'
          : 'bg-white dark:bg-slate-900',
        disabled ? 'cursor-not-allowed text-smoke-500 dark:text-slate-200' : '',
        isClickable
          ? 'cursor-pointer hover:bg-smoke-50 dark:hover:bg-slate-700'
          : '',
        className,
      )}
      role={onClick ? 'button' : undefined}
    >
      {selected ? <XMarkIcon className="h-4 w-4" /> : null}
      {tag}
    </div>
  )
}
