import { t } from '@lingui/macro'
import { Form } from 'antd'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { FormItemExt } from './formItemExt'

export default function ProjectLogoUri({
  name,
  formItemProps,
  hideLabel,
  initialUrl,
  onSuccess,
}: FormItemExt & { initialUrl?: string; onSuccess?: (url?: string) => void }) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : t`Logo`}
      {...formItemProps}
    >
      <FormImageUploader
        value={initialUrl}
        onChange={onSuccess}
        maxSizeKBs={10000}
        text={t`Upload`}
      />
    </Form.Item>
  )
}
