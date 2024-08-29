import { Form } from 'antd'
import { TreasurySelection } from 'models/treasurySelection'
import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import { allocationToSplit, splitToAllocation } from 'packages/v2v3/utils/splitToAllocation'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useEditingPayoutSplits } from 'redux/hooks/useEditingPayoutSplits'

type PayoutsFormProps = Partial<{
  selection: TreasurySelection
  payoutsList: AllocationSplit[]
}>

export const usePayoutsForm = () => {
  const [form] = Form.useForm<PayoutsFormProps>()
  const { treasurySelection } = useAppSelector(state => state.editingV2Project)
  const [splits, setSplits] = useEditingPayoutSplits()
  useDebugValue(form.getFieldsValue())

  const initialValues: PayoutsFormProps | undefined = useMemo(() => {
    const selection = treasurySelection ?? 'zero'
    if (!splits.length) {
      return { selection }
    }
    const payoutsList: AllocationSplit[] = splits.map(splitToAllocation)
    return { payoutsList, selection }
  }, [splits, treasurySelection])

  const dispatch = useAppDispatch()
  const payoutsList = Form.useWatch('payoutsList', form)
  const selection = Form.useWatch('selection', form)

  useEffect(() => {
    setSplits(payoutsList?.map(allocationToSplit) ?? [])
  }, [dispatch, payoutsList, selection, setSplits])

  return { initialValues, form }
}
