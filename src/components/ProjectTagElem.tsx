import { CloseOutlined } from '@ant-design/icons'
import { ProjectTag } from 'models/project-tags'
import { twMerge } from 'tailwind-merge'

/**
 * Formatted project tag.
 */
export function ProjectTagElem({
  tag,
  className,
  selected,
  onClick,
}: {
  tag: ProjectTag
  className?: string
  selected?: boolean
  onClick?: (tag: ProjectTag) => void
}) {
  return (
    <div
      onClick={() => onClick?.(tag)}
      className={twMerge(
        'rounded-full py-1 px-3 uppercase',
        selected
          ? 'bg-smoke-300 font-medium dark:bg-slate-400'
          : 'bg-smoke-100 dark:bg-slate-600',
        onClick ? 'cursor-pointer' : '',
        className,
      )}
    >
      {selected ? <CloseOutlined className="mr-2" /> : null}
      {tag}
    </div>
  )
}
