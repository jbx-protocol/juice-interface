import { Button, Form, FormInstance } from 'antd'
import { t, Trans } from '@lingui/macro'

import { FormItems } from 'components/shared/formItems'
import { BigNumber } from 'ethers'
import { useState } from 'react'
import { PayoutMod, TicketMod } from 'models/mods'

export type TokenFormFields = {
  discountRate: BigNumber
  reservedRate: BigNumber
  bondingCurveRate: BigNumber
}

export default function TokenForm({
  form,
  reduxDiscountRate,
  reduxReservedRate,
  reduxBondingCurve,
  initialTicketMods,
  setReduxTicketMods,
  onSave,
}: {
  form: FormInstance<TokenFormFields>
  reduxDiscountRate?: string | number
  reduxReservedRate?: string | number
  reduxBondingCurve?: string | number
  initialTicketMods?: PayoutMod[]
  setReduxTicketMods: (mods: TicketMod[]) => void
  onSave: VoidFunction
}) {
  const [discountRateDisabled, setDiscountRateDisabled] = useState<boolean>(
    reduxDiscountRate === undefined ||
      reduxDiscountRate === '0' ||
      reduxDiscountRate === 0,
  )
  const [reservedRateDisabled, setReservedRateDisabled] = useState<boolean>(
    reduxReservedRate === undefined ||
      reduxReservedRate === '0' ||
      reduxReservedRate === 0,
  )
  const [bondingCurveDisabled, setBondingCurveDisabled] = useState<boolean>(
    reduxBondingCurve === undefined ||
      reduxBondingCurve === '100' ||
      reduxBondingCurve === 100,
  )

  const [ticketMods, setTicketMods] = useState<TicketMod[]>(
    initialTicketMods ?? [],
  )

  // Using a state here because relying on the form does not
  // pass through updated reservedRate to ProjectTicketMods
  const [reservedRate, setReservedRate] = useState<number | undefined>(
    form.getFieldValue('reservedRate'),
  )

  return (
    <Form form={form} layout="vertical">
      <FormItems.ProjectDiscountRate
        value={form.getFieldValue('discountRate') ?? reduxDiscountRate} // use redux if form hasn't loaded yet
        name="discountRate"
        onChange={val => {
          form.setFieldsValue({ discountRate: val })
        }}
        disabled={discountRateDisabled}
        toggleDisabled={checked => {
          if (!checked) {
            form.setFieldsValue({ discountRate: 0 })
          } else {
            form.setFieldsValue({ discountRate: 10 })
          }
          setDiscountRateDisabled(!checked)
        }}
      />
      <FormItems.ProjectReserved
        value={form.getFieldValue('reservedRate') ?? reduxReservedRate}
        name="reservedRate"
        onChange={val => {
          setReservedRate(val)
          form.setFieldsValue({ reservedRate: val })
        }}
        disabled={reservedRateDisabled}
        toggleDisabled={checked => {
          if (!checked) {
            form.setFieldsValue({ reservedRate: 0 })
          } else {
            form.setFieldsValue({ reservedRate: 20 })
          }
          setReservedRateDisabled(!checked)
        }}
      />
      {!reservedRateDisabled ? (
        <FormItems.ProjectTicketMods
          name="ticketMods"
          mods={ticketMods}
          onModsChanged={mods => {
            setTicketMods(mods)
            setReduxTicketMods(mods)
          }}
          formItemProps={{
            label: t`Reserved token allocation (optional)`,
            extra: t`Allocate a portion of your project's reserved tokens to other Ethereum wallets or Juicebox projects.`,
          }}
          reservedRate={reservedRate ?? 0}
        />
      ) : null}
      <FormItems.ProjectBondingCurveRate
        name="bondingCurveRate"
        value={form.getFieldValue('bondingCurveRate') ?? reduxBondingCurve}
        onChange={(val?: number) =>
          form.setFieldsValue({ bondingCurveRate: val })
        }
        disabled={bondingCurveDisabled}
        toggleDisabled={checked => {
          if (checked) {
            form.setFieldsValue({ bondingCurveRate: 0 })
          } else {
            form.setFieldsValue({ bondingCurveRate: 100 })
          }
          setBondingCurveDisabled(!checked)
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
          <Trans>Save token configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
