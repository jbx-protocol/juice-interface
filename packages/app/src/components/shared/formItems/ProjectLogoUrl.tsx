import { Form } from 'antd'
import { IPFS_TAGS } from 'utils/ipfs'

import ImageUploader from '../inputs/ImageUploader'
import { FormItemExt } from './formItemExt'

export default function ProjectLogoUrl({
  name,
  formItemProps,
  hideLabel,
  initialUrl,
  onSuccess,
}: FormItemExt & { initialUrl?: string; onSuccess?: (url?: string) => void }) {
  return (
    <Form.Item
      name={name}
      label={hideLabel ? undefined : 'Logo (optional)'}
      {...formItemProps}
    >
      <ImageUploader
        initialUrl={initialUrl}
        onSuccess={onSuccess}
        metadata={{ tag: IPFS_TAGS.LOGO }}
        maxSize={1000000}
      />
    </Form.Item>
  )
}
