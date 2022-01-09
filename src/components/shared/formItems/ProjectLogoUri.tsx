import { Form } from 'antd'
import { t } from '@lingui/macro'

import { IPFS_TAGS } from 'utils/ipfs'

import ImageUploader from '../inputs/ImageUploader'
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
      <ImageUploader
        initialUrl={initialUrl}
        onSuccess={onSuccess}
        metadata={{ tag: IPFS_TAGS.LOGO }}
        maxSize={1000000}
        text={t`Upload`}
      />
    </Form.Item>
  )
}
