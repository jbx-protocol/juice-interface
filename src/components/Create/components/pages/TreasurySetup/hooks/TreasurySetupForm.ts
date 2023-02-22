import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { AllocationSplit } from 'components/Allocation'
import { TreasurySelection } from 'models/treasurySelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { useEditingPayoutSplits } from 'redux/hooks/EditingPayoutSplits'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

type TreasurySetupFormProps = Partial<{
  selection: TreasurySelection
  payoutsList: AllocationSplit[]
}>

export const useTreasurySetupForm = () => {
  const [form] = Form.useForm<TreasurySetupFormProps>()
  const { treasurySelection } = useAppSelector(state => state.editingV2Project)
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  const [splits, setSplits] = useEditingPayoutSplits()
  useDebugValue(form.getFieldsValue())

  const initialValues: TreasurySetupFormProps | undefined = useMemo(() => {
    const selection = treasurySelection ?? 'amount'
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
    dispatch(editingV2ProjectActions.setTreasurySelection(selection))
  }, [dispatch, payoutsList, selection, setSplits])

  useEffect(() => {
    switch (selection) {
      case 'amount':
        if (!splits.length) {
          setDistributionLimit({
            amount: BigNumber.from(0),
            currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
          })
        }
        break
      case 'unlimited':
        setDistributionLimit({
          amount: MAX_DISTRIBUTION_LIMIT,
          currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
        })
        break
      case 'zero':
        setDistributionLimit({
          amount: BigNumber.from(0),
          currency: distributionLimit?.currency ?? V2V3_CURRENCY_ETH,
        })
        form.setFieldsValue({ payoutsList: [] })
        break
    }
  }, [
    distributionLimit?.currency,
    form,
    selection,
    setDistributionLimit,
    setSplits,
    splits.length,
  ])

  return { initialValues, form }
}
