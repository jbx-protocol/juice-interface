import { Trans } from '@lingui/macro'
import { Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import TokenForm, { TokenFormFields } from 'components/shared/forms/TokenForm'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { TicketMod } from 'models/mods'
import { useCallback, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import stripPercent from 'utils/stripPercent'

export default function TokenTabContent() {
  const [tokenForm] = useForm<TokenFormFields>()
  const [ticketMods, setTicketMods] = useState<TicketMod[]>([])

  const dispatch = useAppDispatch()
  const { fundingCycle: editingV2FundingCycle } = useAppSelector(
    state => state.editingV2Project,
  )
  const { ticketMods: reduxTicketMods } = useAppSelector(
    state => state.editingV2Project,
  )

  const onTokenFormSaved = useCallback(() => {
    const fields = tokenForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingV2ProjectActions.setReserved(fields.reservedRate))
    dispatch(
      editingV2ProjectActions.setBondingCurveRate(fields.bondingCurveRate),
    )
    dispatch(editingV2ProjectActions.setTicketMods(ticketMods))
  }, [dispatch, tokenForm, ticketMods])

  const resetTokenForm = useCallback(() => {
    tokenForm.setFieldsValue({
      discountRate: stripPercent(editingV2FundingCycle?.discountRate) ?? 0,
      reservedRate: stripPercent(editingV2FundingCycle?.reserved) ?? 0,
      bondingCurveRate:
        stripPercent(editingV2FundingCycle?.bondingCurveRate) ?? 100,
    })
    setTicketMods(ticketMods)
  }, [
    editingV2FundingCycle?.discountRate,
    editingV2FundingCycle?.reserved,
    editingV2FundingCycle?.bondingCurveRate,
    ticketMods,
    tokenForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  return (
    <div>
      <Space direction="vertical" size="large">
        <p>
          <Trans>
            <strong>Note: </strong>Updates you make to token attributes will{' '}
            <i>not be applied immediately</i> and only take effect in{' '}
            <i>upcoming funding cycles.</i>
          </Trans>
        </p>
        <TokenForm
          form={tokenForm}
          reduxDiscountRate={editingV2FundingCycle?.discountRate}
          reduxReservedRate={editingV2FundingCycle?.reserved}
          reduxBondingCurve={editingV2FundingCycle?.bondingCurveRate}
          ticketMods={ticketMods.length ? ticketMods : reduxTicketMods}
          setTicketMods={setTicketMods}
          onSave={onTokenFormSaved}
        />
      </Space>
    </div>
  )
}
