import { Button, Form, FormInstance, Input, Space } from 'antd'

export type AddLinkFormFields = {
  link: string
}

export default function AddLink({
  form,
  onSave,
  onSkip,
}: {
  form: FormInstance<AddLinkFormFields>
  onSave: VoidFunction
  onSkip: VoidFunction
}) {
  return (
    <Space direction="vertical" size="large">
      <h1>Add a link</h1>
      <p>
        Add a URL that points to where someone could find more information about
        your project. (optional)
      </p>

      <Form form={form} layout="vertical">
        <Form.Item name="link" rules={[{ required: true }]}>
          <Input
            className="align-end"
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
      </Form>

      <Space>
        <Button type="primary" onClick={onSave}>
          Save
        </Button>
        <Button onClick={onSkip}>Skip</Button>
      </Space>
    </Space>
  )
}
