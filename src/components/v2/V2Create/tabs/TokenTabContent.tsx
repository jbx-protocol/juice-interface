import { Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import TokenForm, { TokenFormFields } from 'components/shared/forms/TokenForm'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useEffect } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

export default function TokenTabContent() {
  const [tokenForm] = useForm<TokenFormFields>()
  const dispatch = useAppDispatch()
  const { fundingCycle: editingV2FundingCycle } = useAppSelector(
    state => state.editingV2Project,
  )

  const onTokenFormSaved = useCallback(() => {
    const fields = tokenForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
    dispatch(editingV2ProjectActions.setReserved(fields.reservedRate))
  }, [dispatch, tokenForm])

  const resetTokenForm = useCallback(() => {
    tokenForm.setFieldsValue({
      discountRate: editingV2FundingCycle?.discountRate ?? 0,
    })
  }, [editingV2FundingCycle?.discountRate, tokenForm])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  return (
    <div>
      <Space direction="vertical" size="large">
        <TokenForm form={tokenForm} onSave={onTokenFormSaved} />
      </Space>
    </div>
  )
}
