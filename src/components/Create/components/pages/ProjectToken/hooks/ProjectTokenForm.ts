import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { AllocationSplit } from 'components/Create/components/Allocation'
import { ONE_MILLION } from 'constants/numbers'
import { useAppSelector } from 'hooks/AppSelector'
import { useDebugValue, useEffect, useMemo } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { formatIssuanceRate, issuanceRateFrom } from 'utils/v2v3/math'
import { useFormDispatchWatch } from '../../hooks'

export type ProjectTokensFormProps = Partial<{
  selection: 'default' | 'custom'
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
  } = useAppSelector(state => state.editingV2Project)
  useDebugValue(form.getFieldsValue())

  const initialValues: ProjectTokensFormProps | undefined = useMemo(() => {
    const initialMintRate = fundingCycleData?.weight
      ? formatIssuanceRate(fundingCycleData.weight)
      : DefaultSettings.initialMintRate
    const reservedTokensPercentage = fundingCycleMetadata.reservedRate
      ? parseFloat(fundingCycleMetadata.reservedRate)
      : DefaultSettings.reservedTokensPercentage
    // TODO
    const reservedTokenAllocation: AllocationSplit[] = []
    // TODO: we should probably block this if no duration set
    const discountRate = fundingCycleData.discountRate
      ? parseFloat(fundingCycleData.discountRate)
      : DefaultSettings.discountRate
    const redemptionRate = fundingCycleMetadata.redemptionRate
      ? parseFloat(fundingCycleMetadata.redemptionRate)
      : DefaultSettings.redemptionRate
    const tokenMinting =
      fundingCycleMetadata.allowMinting !== undefined
        ? fundingCycleMetadata.allowMinting
        : DefaultSettings.tokenMinting

    return {
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
  ])

  const selection = useWatch('selection', form)

  useEffect(() => {
    if (selection === 'default') {
      form.setFieldsValue({ ...DefaultSettings })
      return
    }
  }, [form, selection])

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
      return v.toString()
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
      return v.toString()
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: editingV2ProjectActions.setRedemptionRate,
    formatter: v => {
      if (!v || typeof v !== 'number') return ''
      return v.toString()
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
