import { ProjectTag } from 'models/project-tags'
import { useCallback, useMemo, useState } from 'react'

import { ProjectTagElem } from './ProjectTagElem'

export default function ProjectTagsEditor({
  tags,
  value: v,
  onChange,
}: {
  tags: ProjectTag[]
  value?: ProjectTag[]
  onChange?: (tags: ProjectTag[]) => void
}) {
  // Used as a fallback when value and onChange are not supplied or used
  const [_value, _setValue] = useState<ProjectTag[]>([])

  const value = v ?? _value
  const setValue = onChange ?? _setValue

  const addTag = useCallback(
    (tag: ProjectTag) => {
      return () => setValue([...value, tag])
    },
    [setValue, value],
  )

  const removeTag = useCallback(
    (tag: ProjectTag) => {
      return () => {
        const i = value.indexOf(tag)
        if (i === -1) return
        setValue([...value.slice(0, i), ...value.slice(i + 1)])
      }
    },
    [setValue, value],
  )

  // Tags that are still selectable. Filters out any tags that have already been selected.
  const selectableTags = useMemo(
    () => tags.filter(t => !value.includes(t)),
    [tags, value],
  )

  return (
    <div>
      <div className="mb-3 flex select-none flex-wrap gap-1">
        {value.map(t => (
          <ProjectTagElem selected key={t} tag={t} onClick={removeTag(t)} />
        ))}
      </div>

      <div className="flex select-none flex-wrap gap-1">
        {selectableTags.map(t => (
          <ProjectTagElem key={t} tag={t} onClick={addTag(t)} />
        ))}
      </div>
    </div>
  )
}
