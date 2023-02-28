import { ProjectTag } from 'models/project-tags'

import ProjectTagElem from './ProjectTagElem'

export default function ProjectTagsRow({
  tags,
  onClickTag,
  tagClassName,
}: {
  tags: ProjectTag[] | undefined
  onClickTag?: (tag: ProjectTag) => void
  tagClassName?: string
}) {
  if (!tags?.length) return null

  return (
    <div className="flex select-none flex-wrap gap-1">
      {tags.map(t => (
        <ProjectTagElem
          key={t}
          tag={t}
          onClick={() => onClickTag?.(t)}
          className={tagClassName}
        />
      ))}
    </div>
  )
}
