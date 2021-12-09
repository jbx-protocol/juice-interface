import { Button, Form, FormInstance, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { Switch } from 'react-router'

export type RestrictedActionsFormFields = {
  payIsPaused: boolean
  printingTicketsIsAllowed: boolean
}

export default function RestrictedActionsForm({
  form,
  onSave,
}: {
  form: FormInstance<RestrictedActionsFormFields>
  onSave: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Space direction="vertical" size="large">
      <div style={{ color: colors.text.secondary }}>
        <h1>Restricted actions</h1>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="payIsPaused"
          label="Pause payments"
          extra="Your project cannot receive payments while this is enabled."
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="printingTicketsIsAllowed"
          label="Allow printing tokens"
          extra="Enabling this allows the project owner to manually mint any amount of tokens to any address."
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={() => onSave()}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
