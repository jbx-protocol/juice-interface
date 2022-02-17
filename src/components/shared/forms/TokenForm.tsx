import { Button, Form, FormInstance } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { useState } from 'react'
import { TicketMod } from 'models/mods'

export type TokenFormFields = {
  discountRate: string
  reservedRate: string
  bondingCurveRate: string
}

export default function TokenForm({
  form,
  onSave,
}: {
  form: FormInstance<TokenFormFields>
  onSave: (fields: TokenFormFields) => void
}) {
  const [mods, setMods] = useState<TicketMod[]>([])
  const [discountRateDisabled, setDiscountRateDisabled] = useState<boolean>(
    !Boolean(form.getFieldValue('discountRate')),
  )
  const [reservedRateDisabled, setReservedRateDisabled] = useState<boolean>(
    !Boolean(form.getFieldValue('reservedRate')),
  )
  const [bondingCurveDisabled, setBondingCurveDisabled] = useState<boolean>(
    !Boolean(form.getFieldValue('bondingCurveRate')) &&
      form.getFieldValue('bondingCurveRate') !== 100,
  )

  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(
    form.getFieldValue('reservedRate'),
  )

  return (
    <Form form={form} layout="vertical" onFinish={onSave}>
      <FormItems.ProjectDiscountRate
        value={form.getFieldValue('discountRate')}
        name="discountRate"
        onChange={val => {
          form.setFieldsValue({ discountRate: val?.toString() })
        }}
        disabled={discountRateDisabled}
        toggleDisabled={checked => setDiscountRateDisabled(!checked)}
      />
      <FormItems.ProjectReserved
        value={form.getFieldValue('reservedRate')}
        name="reservedRate"
        onChange={val => {
          setReservedRate(val)
          form.setFieldsValue({ reservedRate: val?.toString() })
        }}
        disabled={reservedRateDisabled}
        toggleDisabled={checked => setReservedRateDisabled(!checked)}
      />
      {!reservedRateDisabled ? (
        <FormItems.ProjectTicketMods
          name="ticketMods"
          mods={mods}
          onModsChanged={setMods}
          formItemProps={{
            label: t`Reserved token allocation (optional)`,
            extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
          }}
          reservedRate={reservedRate ?? 0}
        />
      ) : null}
      <FormItems.ProjectBondingCurveRate
        name="bondingCurveRate"
        value={form.getFieldValue('bondingCurveRate')}
        onChange={(val?: number) =>
          form.setFieldsValue({ bondingCurveRate: val?.toString() })
        }
        disabled={bondingCurveDisabled}
        toggleDisabled={checked => setBondingCurveDisabled(!checked)}
      />
      <Form.Item>
        <Button htmlType="submit" type="primary">
          <Trans>Save token configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
