import { t } from '@lingui/macro'
import { Form } from 'antd'
import ProjectTagsEditor from 'components/ProjectTags/ProjectTagsEditor'
import { ProjectTagName } from 'models/project-tags'

import { FormItemExt } from './formItemExt'

export default function ProjectTagsFormItem({
  name,
  hideLabel,
  formItemProps,
  initialTags,
  onChange,
}: {
  initialTags: ProjectTagName[]
  onChange?: (tags: ProjectTagName[]) => void
} & FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Project tags`}
      extra={t`Select up to 3 tags to help supporters find your project.`}
      {...formItemProps}
    >
      <ProjectTagsEditor initialValue={initialTags} onChange={onChange} />
    </Form.Item>
  )
}
