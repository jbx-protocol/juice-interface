import {
  MAX_PROJECT_TAGS,
  ProjectTagName,
  projectTagOptions,
} from 'models/project-tags'
import { useCallback, useEffect, useState } from 'react'
import { ProjectTag } from './ProjectTag'
import { ProjectTagsList } from './ProjectTagsList'

export default function ProjectTagsEditor({
  initialValue,
  onChange,
}: {
  initialValue?: ProjectTagName[]
  onChange?: (tags: ProjectTagName[]) => void
}) {
  const [value, setValue] = useState<ProjectTagName[]>([])

  useEffect(() => {
    if (initialValue) setValue(initialValue)
  }, [initialValue])

  const update = useCallback(
    (fn: (v: ProjectTagName[]) => ProjectTagName[]) => {
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
      <div className="mb-5 flex select-none flex-wrap gap-1">
        {value.map(t => (
          <ProjectTag
            selected
            key={t}
            tag={t}
            onClick={() => {
              // remove tag
              update(v => v.filter(_t => _t !== t))
            }}
          />
        ))}
      </div>

      <ProjectTagsList
        tags={projectTagOptions.filter(t => !value.includes(t))}
        onClickTag={t => {
          // add tag, but no more than max allowed number
          update(v => [...v, t].slice(0, MAX_PROJECT_TAGS))
        }}
        disabled={value.length === MAX_PROJECT_TAGS}
      />
    </div>
  )
}
