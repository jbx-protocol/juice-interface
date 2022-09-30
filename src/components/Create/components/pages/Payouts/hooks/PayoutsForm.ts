import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

export type PayoutsFormProps = Partial<{
  selection: PayoutsSelection
  payoutsList: AllocationSplit[]
}>

export const usePayoutsForm = () => {
  const [form] = Form.useForm<PayoutsFormProps>()
  const {
    payoutGroupedSplits: { splits },
    payoutsSelection,
  } = useAppSelector(state => state.editingV2Project)

  useDebugValue(form.getFieldsValue())

  const initialValues: PayoutsFormProps | undefined = useMemo(() => {
    if (!splits.length) {
      return { selection: payoutsSelection }
    }
    const payoutsList: AllocationSplit[] = splits.map(s => ({
      id: `${s.beneficiary}${s.projectId ? `-${s.projectId}` : ''}`,
      ...s,
    }))
    return { payoutsList, selection: payoutsSelection }
  }, [payoutsSelection, splits])

  const dispatch = useAppDispatch()
  const payoutsList = useWatch('payoutsList', form)
  const selection = useWatch('selection', form)

  useEffect(() => {
    dispatch(editingV2ProjectActions.setPayoutSplits(payoutsList ?? []))
    dispatch(editingV2ProjectActions.setPayoutsSelection(selection))
  }, [dispatch, payoutsList, selection])

  return { form, initialValues }
}
