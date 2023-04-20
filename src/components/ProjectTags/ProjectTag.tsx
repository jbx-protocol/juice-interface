import { XMarkIcon } from '@heroicons/react/24/solid'
import { Badge } from 'components/Badge'
import { ProjectTagName, projectTagText } from 'models/project-tags'
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
    <Badge
      variant="default"
      fill={selected}
      onClick={isClickable ? () => onClick?.(tag) : undefined}
      className={twMerge(
        disabled ? 'cursor-not-allowed text-smoke-500 dark:text-slate-200' : '',
        className,
      )}
    >
      {selected ? <XMarkIcon className="h-4 w-4" /> : null}
      {projectTagText[tag]()}
    </Badge>
  )
}
