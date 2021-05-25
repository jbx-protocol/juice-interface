import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import ImageUploader from 'components/shared/inputs/ImageUploader'
import { useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'
import { ipfsCidUrl } from 'utils/ipfs'
import { IPFS_TAGS } from '../../utils/ipfs'

export type ProjectFormFields = {
  name: string
  infoUri: string
  handle: string
  logoUri: string
}

export default function ProjectForm({
  form,
  onSave,
}: {
  form: FormInstance<ProjectFormFields>
  onSave: VoidFunction
}) {
  const [handle, setHandle] = useState<string>()

  return (
    <Space direction="vertical" size="large">
      <h1>Project info</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{
            rules: [{ required: true }],
          }}
          onChange={name => {
            const val = name ? normalizeHandle(name) : ''
            // Use `handle` state to enable ProjectHandle to validate while typing
            setHandle(val)
            form.setFieldsValue({ handle: val })
          }}
        />
        <FormItems.ProjectHandle
          name="handle"
          value={handle}
          onValueChange={val => form.setFieldsValue({ handle: val })}
          formItemProps={{
            rules: [{ required: true }],
            dependencies: ['name'],
          }}
        />
        <FormItems.ProjectLink name="infoUri" />
        <Form.Item name="logoUri" label="Logo (optional)">
          <ImageUploader
            initialPreview={form.getFieldValue('logoUri')}
            onSuccess={cid => form.setFieldsValue({ logoUri: ipfsCidUrl(cid) })}
            metadata={{ tag: IPFS_TAGS.LOGO }}
            maxSize={1000000}
          />
        </Form.Item>
        <Form.Item>
          <Button
            htmlType="submit"
            type="primary"
            onClick={async () => {
              await form.validateFields()
              onSave()
            }}
          >
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
