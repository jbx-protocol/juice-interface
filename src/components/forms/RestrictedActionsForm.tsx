import { Button, Form, FormInstance, Space, Switch } from 'antd'
import { t, Trans } from '@lingui/macro'

import { ThemeContext } from 'contexts/themeContext'
import { useContext, useEffect, useState } from 'react'

import FormItemWarningText from '../FormItemWarningText'

export type RestrictedActionsFormFields = {
  payIsPaused: boolean
  ticketPrintingIsAllowed: boolean
}

export default function RestrictedActionsForm({
  form,
  onSave,
  hasFundingDuration,
}: {
  form: FormInstance<RestrictedActionsFormFields>
  onSave: VoidFunction
  hasFundingDuration?: boolean
}) {
  const [showTicketPrintingWarning, setShowTicketPrintingWarning] =
    useState<boolean>()

  useEffect(() => {
    setShowTicketPrintingWarning(form.getFieldValue('ticketPrintingIsAllowed'))
  }, [form])

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <Space direction="vertical" size="large">
      <div style={{ color: colors.text.secondary }}>
        <h1>
          <Trans>Restricted actions</Trans>
        </h1>
        {hasFundingDuration ? (
          <p>
            <Trans>
              <strong>Note:</strong> These properties will <strong>not</strong>{' '}
              be editable immediately within a funding cycle. They can only be
              changed for <strong>upcoming</strong> funding cycles.
            </Trans>
          </p>
        ) : null}
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
          name="ticketPrintingIsAllowed"
          label={t`Allow minting tokens`}
          extra={t`Enabling this allows the project owner to manually mint any amount of tokens to any address.`}
          valuePropName="checked"
        >
          <Switch
            onChange={val => {
              setShowTicketPrintingWarning(val)
            }}
          />
        </Form.Item>
        {showTicketPrintingWarning && (
          <Form.Item>
            <FormItemWarningText>
              <Trans>
                Enabling token minting will appear risky to contributors.
              </Trans>
            </FormItemWarningText>
          </Form.Item>
        )}
        <Form.Item>
          <Button htmlType="submit" type="primary" onClick={() => onSave()}>
            <Trans>Save</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Space>
  )
}
