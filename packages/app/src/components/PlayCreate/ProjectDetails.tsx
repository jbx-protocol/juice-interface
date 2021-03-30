import { Button, Form, FormInstance, Input, Space } from 'antd'

export type ProjectDetailsFormFields = {
  link: string
  handle: string
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
        <Form.Item label="Handle" name="handle" rules={[{ required: true }]}>
          <Input
            prefix="@"
            placeholder="yourProject"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          extra="Add a URL that points to where someone could find more information about
        your project. (optional)"
        >
          <Input
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        {/* TODO */}
        {/* <Form.Item name="logoUri">
          <Input
            className="align-end"
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item> */}
        <Form.Item>
          <Space>
            <Button htmlType="submit" type="primary" onClick={onSave}>
              Save
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Space>
  )
}
