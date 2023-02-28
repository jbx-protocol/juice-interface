import { t } from '@lingui/macro'
import { Form } from 'antd'
import ProjectTagsEditor from 'components/ProjectTagsEditor'
import { ProjectTag } from 'models/project-tags'

import { FormItemExt } from './formItemExt'

export default function ProjectTagsFormItem({
  name,
  hideLabel,
  formItemProps,
  initialTags,
  onChange,
}: {
  initialTags: ProjectTag[]
  onChange?: (tags: ProjectTag[]) => void
} & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Project tags`}
      {...formItemProps}
    >
      <div className="mb-3">{t`Select up to 3 tags to help contributors find your project.`}</div>
      <ProjectTagsEditor initialValue={initialTags} onChange={onChange} />
    </Form.Item>
  )
}
