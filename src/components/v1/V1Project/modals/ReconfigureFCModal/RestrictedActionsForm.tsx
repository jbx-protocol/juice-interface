import { t, Trans } from '@lingui/macro'
import { Button, Form, FormInstance, Space, Switch } from 'antd'
import FormItemWarningText from 'components/FormItemWarningText'
import {
  OWNER_MINTING_EXPLANATION,
  OWNER_MINTING_RISK,
  PAUSE_PAYMENTS_EXPLANATION,
} from 'components/strings'
import { useEffect, useState } from 'react'

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

  return (
    <Space direction="vertical" size="large">
      <div className="text-grey-500 dark:text-grey-300">
        <h1>
          <Trans>Other rules</Trans>
        </h1>
        {hasFundingDuration ? (
          <p>
            <Trans>
              <strong>Note:</strong> These properties are locked during each
              cycle. They can only be edited for <strong>upcoming</strong>{' '}
              cycles.
            </Trans>
          </p>
        ) : null}
      </div>

      <Form form={form} layout="vertical">
        <Form.Item
          name="payIsPaused"
          label={t`Pause payments to this project`}
          extra={PAUSE_PAYMENTS_EXPLANATION}
          valuePropName={'checked'}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="ticketPrintingIsAllowed"
          label={t`Allow owner token minting`}
          extra={OWNER_MINTING_EXPLANATION}
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
            <FormItemWarningText>{OWNER_MINTING_RISK}</FormItemWarningText>
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
