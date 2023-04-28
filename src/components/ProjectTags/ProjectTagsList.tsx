import { ProjectTagName, projectTagOptions } from 'models/project-tags'
import { ProjectTag } from './ProjectTag'

/**
 * Displays project tags in a formatted row.
 *
 * @param tags The tags to be rendered. If undefined, all tag options will be rendered.
 * @param onClickTag Function called when a tag is clicked.
 * @param tagClassName Classname applied to individual tag elements.
 */
export function ProjectTagsList({
  tags,
  onClickTag,
  tagClassName,
  disabled,
  withLinks,
}: {
  tags?: ProjectTagName[] | undefined
  onClickTag?: (tag: ProjectTagName) => void
  tagClassName?: string
  disabled?: boolean
  withLinks?: boolean
}) {
  // If tags are undefined, show all tags
  const _tags = tags ?? projectTagOptions

  return (
    <ul className="m-0 flex flex-wrap gap-y-2 gap-x-1">
      {_tags.map(t => (
        <li key={t}>
          <ProjectTag
            tag={t}
            onClick={onClickTag ? () => onClickTag(t) : undefined}
            className={tagClassName}
            disabled={disabled}
            isLink={withLinks}
          />
        </li>
      ))}
    </ul>
  )
}
