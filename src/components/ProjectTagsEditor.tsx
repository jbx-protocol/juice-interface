import {
  MAX_PROJECT_TAGS,
  ProjectTag,
  projectTagOptions,
} from 'models/project-tags'
import { useCallback, useEffect, useState } from 'react'

import { ProjectTagElem } from './ProjectTagElem'
import { ProjectTagsRow } from './ProjectTagsRow'

export default function ProjectTagsEditor({
  initialValue,
  onChange,
}: {
  initialValue?: ProjectTag[]
  onChange?: (tags: ProjectTag[]) => void
}) {
  const [value, setValue] = useState<ProjectTag[]>([])

  useEffect(() => {
    if (initialValue) setValue(initialValue)
  }, [initialValue])

  const update = useCallback(
    (fn: (v: ProjectTag[]) => ProjectTag[]) => {
      setValue(v => {
        const newValue = fn(v)
        onChange?.(newValue)
        return newValue
      })
    },
    [onChange],
  )

  return (
    <div>
      <div className="mb-3 flex select-none flex-wrap gap-1">
        {value.map(t => (
          <ProjectTagElem
            selected
            key={t}
            tag={t}
            onClick={() => update(v => v.filter(_t => _t !== t))}
          />
        ))}
      </div>

      <ProjectTagsRow
        tags={projectTagOptions.filter(t => !value.includes(t))}
        onClickTag={t => update(v => [...v, t].slice(0, MAX_PROJECT_TAGS))}
      />
    </div>
  )
}
