import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { AllocationSplit } from 'components/Create/components/Allocation'
import {
  allocationToSplit,
  splitToAllocation,
} from 'components/Create/utils/splitToAllocation'
import { ONE_MILLION } from 'constants/numbers'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useEditingReservedTokensSplits } from 'redux/hooks/EditingReservedTokensSplits'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import {
  discountRateFrom,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2v3/math'
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

export const DefaultSettings: Required<
  Omit<ProjectTokensFormProps, 'selection'>
> = {
  initialMintRate: ONE_MILLION.toString(),
  reservedTokensPercentage: 0,
  reservedTokenAllocation: [],
  discountRate: 0,
  redemptionRate: 100,
  tokenMinting: false,
}

/**
 * There is a lot of witchcraft going on here. Maintainers beware.
 */
export const useProjectTokensForm = () => {
  const [form] = Form.useForm<ProjectTokensFormProps>()
  const { fundingCycleMetadata, fundingCycleData, projectTokensSelection } =
    useAppSelector(state => state.editingV2Project)
  const [tokenSplits] = useEditingReservedTokensSplits()
  useDebugValue(form.getFieldsValue())

  const initialValues: ProjectTokensFormProps | undefined = useMemo(() => {
    const selection = projectTokensSelection
    const initialMintRate = fundingCycleData?.weight
      ? formatIssuanceRate(fundingCycleData.weight)
      : DefaultSettings.initialMintRate
    const reservedTokensPercentage = fundingCycleMetadata.reservedRate
      ? parseFloat(formatReservedRate(fundingCycleMetadata.reservedRate))
      : DefaultSettings.reservedTokensPercentage
    const reservedTokenAllocation: AllocationSplit[] =
      tokenSplits.map(splitToAllocation)
    // TODO: we should probably block this if no duration set
    const discountRate = fundingCycleData.discountRate
      ? parseFloat(formatDiscountRate(fundingCycleData.discountRate))
      : DefaultSettings.discountRate
    const redemptionRate = fundingCycleMetadata.redemptionRate
      ? parseFloat(formatRedemptionRate(fundingCycleMetadata.redemptionRate))
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
    tokenSplits,
  ])

  const dispatch = useAppDispatch()
  const selection = useWatch('selection', form)

  useEffect(() => {
    // We only want to update changes when selection is set
    if (selection === undefined) return
    dispatch(editingV2ProjectActions.setProjectTokensSelection(selection))

    if (selection === 'default') {
      form.setFieldsValue({ ...DefaultSettings })
      dispatch(editingV2ProjectActions.setTokenSettings(DefaultSettings))
      return
    }
    dispatch(
      editingV2ProjectActions.setTokenSettings({
        ...DefaultSettings,
        ...form.getFieldsValue(),
      }),
    )
  }, [dispatch, form, selection])

  useFormDispatchWatch({
    form,
    fieldName: 'initialMintRate',
    dispatchFunction: editingV2ProjectActions.setWeight,
    formatter: v => {
      if (v === undefined || typeof v !== 'string')
        return issuanceRateFrom(DefaultSettings.initialMintRate)
      return issuanceRateFrom(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'reservedTokensPercentage',
    dispatchFunction: editingV2ProjectActions.setReservedRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return reservedRateFrom(
          DefaultSettings.reservedTokensPercentage,
        ).toHexString()
      return reservedRateFrom(v).toHexString()
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'reservedTokenAllocation',
    ignoreUndefined: true, // Needed to stop an infinite loop
    currentValue: tokenSplits, // Needed to stop an infinite loop
    dispatchFunction: editingV2ProjectActions.setReservedTokensSplits,
    formatter: v => {
      if (v === undefined || typeof v !== 'object') return []
      return v.map(allocationToSplit)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'discountRate',
    dispatchFunction: editingV2ProjectActions.setDiscountRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return discountRateFrom(DefaultSettings.discountRate).toHexString()
      return discountRateFrom(v).toHexString()
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: editingV2ProjectActions.setRedemptionRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return redemptionRateFrom(DefaultSettings.redemptionRate).toHexString()
      return redemptionRateFrom(v).toHexString()
    },
  })
  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: editingV2ProjectActions.setBallotRedemptionRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return redemptionRateFrom(DefaultSettings.redemptionRate).toHexString()
      return redemptionRateFrom(v).toHexString()
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
