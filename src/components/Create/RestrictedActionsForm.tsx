import { Button, Form, FormInstance, Space, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export type RestrictedActionsFormFields = {
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
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
        <h1>
          <Trans>Restricted actions</Trans>
        </h1>
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="payIsPaused"
          label={t`Pause payments`}
          extra={t`Your project cannot receive direct payments while paused.`}
          valuePropName={'checked'}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name={t`ticketPrintingIsAllowed`}
          label={t`Allow minting tokens`}
          extra={t`Enabling this allows the project owner to manually mint any amount of tokens to any address.`}
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={() => onSave()}>
            <Trans>Save</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
