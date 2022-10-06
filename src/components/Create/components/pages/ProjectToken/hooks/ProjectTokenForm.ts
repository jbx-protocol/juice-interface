import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { ONE_MILLION } from 'constants/numbers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromReduxPercent, toReduxPercent } from 'redux/util'
import { formatIssuanceRate, issuanceRateFrom } from 'utils/v2v3/math'
import { useFormDispatchWatch } from '../../hooks'

export type ProjectTokensFormProps = Partial<{
  selection: ProjectTokensSelection
  initialMintRate: string | undefined
  reservedTokensPercentage: number | undefined
  reservedTokenAllocation: AllocationSplit[] | undefined
  discountRate: number | undefined
  redemptionRate: number | undefined
  tokenMinting: boolean | undefined
}>

const DefaultSettings: Required<Omit<ProjectTokensFormProps, 'selection'>> = {
  initialMintRate: ONE_MILLION.toString(),
  reservedTokensPercentage: 0,
  reservedTokenAllocation: [],
  discountRate: 0,
  redemptionRate: 100,
  tokenMinting: false,
}

export const useProjectTokensForm = () => {
  const [form] = Form.useForm<ProjectTokensFormProps>()
  const {
    fundingCycleMetadata,
    fundingCycleData,
    reservedTokensGroupedSplits,
    projectTokensSelection,
  } = useAppSelector(state => state.editingV2Project)
  useDebugValue(form.getFieldsValue())

  const initialValues: ProjectTokensFormProps | undefined = useMemo(() => {
    const selection = projectTokensSelection
    const initialMintRate = fundingCycleData?.weight
      ? formatIssuanceRate(fundingCycleData.weight)
      : DefaultSettings.initialMintRate
    const reservedTokensPercentage = fundingCycleMetadata.reservedRate
      ? fromReduxPercent(fundingCycleMetadata.reservedRate)
      : DefaultSettings.reservedTokensPercentage
    // TODO
    const reservedTokenAllocation: AllocationSplit[] = []
    // TODO: we should probably block this if no duration set
    const discountRate = fundingCycleData.discountRate
      ? fromReduxPercent(fundingCycleData.discountRate)
      : DefaultSettings.discountRate
    const redemptionRate = fundingCycleMetadata.redemptionRate
      ? fromReduxPercent(fundingCycleMetadata.redemptionRate)
      : DefaultSettings.redemptionRate
    const tokenMinting =
      fundingCycleMetadata.allowMinting !== undefined
        ? fundingCycleMetadata.allowMinting
        : DefaultSettings.tokenMinting

    return {
      selection,
      initialMintRate,
      reservedTokensPercentage,
      reservedTokenAllocation,
      discountRate,
      redemptionRate,
      tokenMinting,
    }
  }, [
    fundingCycleData.discountRate,
    fundingCycleData.weight,
    fundingCycleMetadata.allowMinting,
    fundingCycleMetadata.redemptionRate,
    fundingCycleMetadata.reservedRate,
    projectTokensSelection,
  ])

  const dispatch = useAppDispatch()
  const selection = useWatch('selection', form)

  useEffect(() => {
    dispatch(editingV2ProjectActions.setProjectTokensSelection(selection))

    if (selection === 'default') {
      form.setFieldsValue({ ...DefaultSettings })
      return
    }
  }, [dispatch, form, selection])

  useFormDispatchWatch({
    form,
    fieldName: 'initialMintRate',
    dispatchFunction: editingV2ProjectActions.setWeight,
    formatter: v => {
      if (!v || typeof v !== 'string') return ''
      return issuanceRateFrom(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'reservedTokensPercentage',
    dispatchFunction: editingV2ProjectActions.setReservedRate,
    formatter: v => {
      if (!v || typeof v !== 'number') return ''
      return toReduxPercent(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'reservedTokenAllocation',
    ignoreUndefined: true, // Needed to stop an infinite loop
    currentValue: reservedTokensGroupedSplits.splits, // Needed to stop an infinite loop
    dispatchFunction: editingV2ProjectActions.setReservedTokensSplits,
    formatter: v => {
      if (!v || typeof v !== 'object') return []
      return v
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'discountRate',
    dispatchFunction: editingV2ProjectActions.setDiscountRate,
    formatter: v => {
      if (!v || typeof v !== 'number') return ''
      return toReduxPercent(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: editingV2ProjectActions.setRedemptionRate,
    formatter: v => {
      if (!v || typeof v !== 'number') return ''
      return toReduxPercent(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'tokenMinting',
    dispatchFunction: editingV2ProjectActions.setAllowMinting,
    formatter: v => {
      if (typeof v !== 'boolean') return false
      return v
    },
  })

  return { form, initialValues }
}
