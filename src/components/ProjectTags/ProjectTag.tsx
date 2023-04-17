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
  disabled,
}: {
  tag: ProjectTagName
  className?: string
  selected?: boolean
  onClick?: (tag: ProjectTagName) => void
  disabled?: boolean
}) {
  const isClickable = Boolean(!disabled && onClick)

  return (
    <div
      onClick={isClickable ? () => onClick?.(tag) : undefined}
      className={twMerge(
        'flex items-center gap-1 rounded-full py-1 px-3 uppercase',
        selected
          ? 'bg-smoke-300 font-medium dark:bg-slate-400'
          : 'bg-smoke-100 dark:bg-slate-600',
        disabled ? 'cursor-not-allowed text-smoke-500 dark:text-slate-200' : '',
        isClickable
          ? 'cursor-pointer hover:bg-smoke-200 dark:hover:bg-slate-500'
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
