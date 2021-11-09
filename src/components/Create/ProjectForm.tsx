import { Button, Form, FormInstance, Input, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'

export type ProjectFormFields = {
  name: string
  description: string
  infoUri: string
  handle: string
  logoUri: string
  twitter: string
  discord: string
  payText: string
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
      <h1>Identity</h1>

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
          requireState="notExist"
          formItemProps={{
            rules: [{ required: true }],
            dependencies: ['name'],
          }}
        />
        <FormItems.ProjectDescription name="description" />
        <FormItems.ProjectLink name="infoUri" />
        <FormItems.ProjectTwitter name="twitter" />
        <FormItems.ProjectDiscord name="discord" />
        <Form.Item
          name="payText"
          label="Pay text"
          extra={'Text displayed on your project\'s "pay" button.'}
        >
          <Input placeholder="Pay" />
        </Form.Item>
        <FormItems.ProjectLogoUri
          name="logoUri"
          initialUrl={form.getFieldValue('logoUri')}
          onSuccess={logoUri => {
            const prevUrl = form.getFieldValue('logoUri')
            // Unpin previous file
            form.setFieldsValue({ logoUri })
            if (prevUrl) unpinIpfsFileByCid(cidFromUrl(prevUrl))
          }}
        />
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
