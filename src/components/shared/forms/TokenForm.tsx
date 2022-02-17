import { Button, Form, FormInstance } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { TicketMod } from 'models/mods'

export type TokenFormFields = {
  discountRate: BigNumber
  reservedRate: BigNumber
  bondingCurveRate: BigNumber
}

export default function TokenForm({
  form,
  onSave,
}: {
  form: FormInstance<TokenFormFields>
  onSave: VoidFunction
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

  console.log('bondingCurveRate: ', form.getFieldValue('bondingCurveRate'))

  return (
    <Form form={form} layout="vertical">
      <FormItems.ProjectDiscountRate
        value={form.getFieldValue('discountRate')}
        name="discountRate"
        onChange={val => {
          form.setFieldsValue({ discountRate: val })
        }}
        disabled={discountRateDisabled}
        toggleDisabled={checked => setDiscountRateDisabled(!checked)}
      />
      <FormItems.ProjectReserved
        value={form.getFieldValue('reservedRate')}
        name="reservedRate"
        onChange={val => {
          setReservedRate(val)
          form.setFieldsValue({ reservedRate: val })
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
          form.setFieldsValue({ bondingCurveRate: val })
        }
        disabled={bondingCurveDisabled}
        toggleDisabled={checked => setBondingCurveDisabled(!checked)}
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
          <Trans>Save token configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
