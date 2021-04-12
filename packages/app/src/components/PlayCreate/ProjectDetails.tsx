import { Button, Form, FormInstance, Space } from 'antd'
import { FormItems } from 'components/shared/formItems'

export type ProjectDetailsFormFields = {
  link: string
  handle: string
  logoUri: string
}

export default function ProjectDetails({
  form,
  onSave,
}: {
  form: FormInstance<ProjectDetailsFormFields>
  onSave: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Project details</h1>

      <Form form={form} layout="vertical">
        <FormItems.ProjectHandle
          name="handle"
          value={form.getFieldValue('handle')}
          onChange={handle => form.setFieldsValue({ handle })}
          formItemProps={{
            rules: [{ required: true }],
          }}
        />
        <FormItems.ProjectLink name="link" />
        <FormItems.ProjectLogoUri name="logoUri" />
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
