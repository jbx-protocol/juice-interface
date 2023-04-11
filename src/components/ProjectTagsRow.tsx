import { ProjectTag, projectTagOptions } from 'models/project-tags'

import { ProjectTagElem } from './ProjectTagElem'

/**
 * Displays project tags in a formatted row.
 *
 * @param tags The tags to be rendered. If undefined, all tag options will be rendered.
 * @param onClickTag Function called when a tag is clicked.
 * @param tagClassName Classname applied to individual tag elements.
 */
export function ProjectTagsRow({
  tags,
  onClickTag,
  tagClassName,
}: {
  tags?: ProjectTag[] | undefined
  onClickTag?: (tag: ProjectTag) => void
  tagClassName?: string
}) {
  // If tags are undefined, show all tags
  const _tags = tags ?? projectTagOptions

  return (
    <div className="flex select-none flex-wrap gap-1">
      {_tags.map(t => (
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
