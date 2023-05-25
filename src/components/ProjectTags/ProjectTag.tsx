import { XMarkIcon } from '@heroicons/react/24/solid'
import { Badge } from 'components/Badge'
import { ProjectTagName, projectTagText } from 'models/project-tags'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'

export function ProjectTag({
  tag,
  className,
  selected,
  onClick,
  isLink,
  disabled,
}: {
  tag: ProjectTagName
  className?: string
  selected?: boolean
  onClick?: (tag: ProjectTagName) => void
  isLink?: boolean
  disabled?: boolean
}) {
  const isClickable = Boolean(!disabled && onClick) || Boolean(isLink)

  const baseTag = (
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

  if (isLink) {
    return <Link href={`/projects?tab=all&tags=${tag}`}>{baseTag}</Link>
  }

  return baseTag
}
