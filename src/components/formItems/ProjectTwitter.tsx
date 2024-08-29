import { t } from '@lingui/macro'
import { Form } from 'antd'

import { TwitterHandleInputWrapper } from 'packages/v2v3/components/Create/components/pages/ProjectDetails/ProjectDetailsPage'
import { FormItemExt } from './formItemExt'

export default function ProjectTwitter({
  name,
  hideLabel,
  formItemProps,
}: FormItemExt) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Twitter handle`}
      {...formItemProps}
    >
      <TwitterHandleInputWrapper />
    </Form.Item>
  )
}
