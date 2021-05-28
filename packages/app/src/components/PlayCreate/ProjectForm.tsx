import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'
import { useState } from 'react'
import { normalizeHandle } from 'utils/formatHandle'
import { cidFromUrl, unpinIpfsFileByCid } from 'utils/ipfs'

export type ProjectFormFields = {
  name: string
  infoUrl: string
  handle: string
  logoUrl: string
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
        <FormItems.ProjectLink name="infoUrl" />
        <FormItems.ProjectLogoUrl
          name="logoUrl"
          initialUrl={form.getFieldValue('logoUrl')}
          onSuccess={logoUrl => {
            form.setFieldsValue({ logoUrl })
            // Unpin previous file
            const prevUrl = form.getFieldValue('logoUrl')
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
