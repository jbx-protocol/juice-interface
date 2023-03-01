import { ProjectTag } from 'models/project-tags'

import ProjectTagElem from './ProjectTagElem'

export default function ProjectTagsRow({
  tags,
  selectedTags,
  onClickTag,
  tagClassName,
}: {
  tags: ProjectTag[] | undefined
  selectedTags?: ProjectTag[]
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
          selected={selectedTags?.includes(t)}
        />
      ))}
    </div>
  )
}
