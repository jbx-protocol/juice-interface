import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { AllocationSplit } from 'components/Create/components/Allocation'
import {
  allocationToSplit,
  splitToAllocation,
} from 'components/Create/utils/splitToAllocation'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { PayoutsSelection } from 'models/payoutsSelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { useAvailablePayoutsSelections } from './AvailablePayoutsSelections'

export type PayoutsFormProps = Partial<{
  selection: PayoutsSelection
  payoutsList: AllocationSplit[]
}>

export const usePayoutsForm = () => {
  const [form] = Form.useForm<PayoutsFormProps>()
  const { payoutsSelection } = useAppSelector(state => state.editingV2Project)
  const availableSelections = useAvailablePayoutsSelections()
  const [splits, setSplits] = useEditingPayoutSplits()

  const overridenSelection = useMemo(
    () =>
      availableSelections.size === 1 ? [...availableSelections][0] : undefined,
    [availableSelections],
  )

  useDebugValue(form.getFieldsValue())

  const initialValues: PayoutsFormProps | undefined = useMemo(() => {
    const selection = overridenSelection ?? payoutsSelection
    if (!splits.length) {
      return { selection }
    }
    const payoutsList: AllocationSplit[] = splits.map(splitToAllocation)
    return { payoutsList, selection }
  }, [overridenSelection, payoutsSelection, splits])

  const dispatch = useAppDispatch()
  const payoutsList = useWatch('payoutsList', form)
  const selection = useWatch('selection', form)

  useEffect(() => {
    setSplits(payoutsList?.map(allocationToSplit) ?? [])
    dispatch(editingV2ProjectActions.setPayoutsSelection(selection))
  }, [dispatch, payoutsList, selection, setSplits])

  return { form, initialValues }
}
