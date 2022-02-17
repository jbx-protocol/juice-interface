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
  const { fundingCycleData } = useAppSelector(state => state.editingV2Project)

  const onTokenFormSaved = useCallback(
    (fields: TokenFormFields) => {
      dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
      dispatch(editingV2ProjectActions.setReservedRate(fields.reservedRate))
    },
    [dispatch],
  )

  const resetTokenForm = useCallback(() => {
    tokenForm.setFieldsValue({
      discountRate: fundingCycleData?.discountRate ?? '0',
    })
  }, [fundingCycleData?.discountRate, tokenForm])

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
