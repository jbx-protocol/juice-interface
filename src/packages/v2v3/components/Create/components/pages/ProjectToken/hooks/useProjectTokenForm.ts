import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { ONE_MILLION } from 'constants/numbers'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import {
  MAX_DISTRIBUTION_LIMIT,
  discountRateFrom,
  formatDiscountRate,
  formatIssuanceRate,
  formatRedemptionRate,
  formatReservedRate,
  issuanceRateFrom,
  redemptionRateFrom,
  reservedRateFrom,
} from 'packages/v2v3/utils/math'
import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import {
  useCreatingDistributionLimit,
  useCreatingReservedTokensSplits,
} from 'redux/hooks/v2v3/create'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'

export type ProjectTokensFormProps = Partial<{
  selection: ProjectTokensSelection
  initialMintRate: string | undefined
  reservedTokensPercentage: number | undefined
  reservedTokenAllocation: AllocationSplit[] | undefined
  discountRate: number | undefined
  redemptionRate: number | undefined
  tokenMinting: boolean | undefined
  pauseTransfers: boolean | undefined
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
  pauseTransfers: false,
}

/**
 * There is a lot of witchcraft going on here. Maintainers beware.
 */
export const useProjectTokensForm = () => {
  const [form] = Form.useForm<ProjectTokensFormProps>()
  const { fundingCycleMetadata, fundingCycleData, projectTokensSelection } =
    useAppSelector(state => state.creatingV2Project)
  const [tokenSplits] = useCreatingReservedTokensSplits()
  useDebugValue(form.getFieldsValue())
  const [distributionLimit] = useCreatingDistributionLimit()

  const redemptionRateDisabled =
    !distributionLimit || distributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)
  const discountRateDisabled = !parseInt(fundingCycleData.duration)

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
    const discountRate =
      !discountRateDisabled && fundingCycleData.discountRate
        ? parseFloat(formatDiscountRate(fundingCycleData.discountRate))
        : DefaultSettings.discountRate
    const redemptionRate =
      !redemptionRateDisabled && fundingCycleMetadata.redemptionRate
        ? parseFloat(formatRedemptionRate(fundingCycleMetadata.redemptionRate))
        : DefaultSettings.redemptionRate
    const tokenMinting =
      fundingCycleMetadata.allowMinting !== undefined
        ? fundingCycleMetadata.allowMinting
        : DefaultSettings.tokenMinting
    const pauseTransfers =
      fundingCycleMetadata.global.pauseTransfers !== undefined
        ? fundingCycleMetadata.global.pauseTransfers
        : DefaultSettings.pauseTransfers

    return {
      selection,
      initialMintRate,
      reservedTokensPercentage,
      reservedTokenAllocation,
      discountRate,
      redemptionRate,
      tokenMinting,
      pauseTransfers,
    }
  }, [
    discountRateDisabled,
    fundingCycleData.discountRate,
    fundingCycleData.weight,
    fundingCycleMetadata.allowMinting,
    fundingCycleMetadata.redemptionRate,
    fundingCycleMetadata.reservedRate,
    fundingCycleMetadata.global.pauseTransfers,
    projectTokensSelection,
    redemptionRateDisabled,
    tokenSplits,
  ])

  const dispatch = useAppDispatch()
  const selection = useWatch('selection', form)

  useEffect(() => {
    // We only want to update changes when selection is set
    if (selection === undefined) return
    dispatch(creatingV2ProjectActions.setProjectTokensSelection(selection))

    if (selection === 'default') {
      form.setFieldsValue({ ...DefaultSettings })
      dispatch(creatingV2ProjectActions.setTokenSettings(DefaultSettings))
      return
    }
    dispatch(
      creatingV2ProjectActions.setTokenSettings({
        ...DefaultSettings,
        ...form.getFieldsValue(),
      }),
    )
  }, [dispatch, form, selection])

  useFormDispatchWatch({
    form,
    fieldName: 'initialMintRate',
    dispatchFunction: creatingV2ProjectActions.setWeight,
    formatter: v => {
      if (v === undefined || typeof v !== 'string')
        return issuanceRateFrom(DefaultSettings.initialMintRate)
      return issuanceRateFrom(v)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'reservedTokensPercentage',
    dispatchFunction: creatingV2ProjectActions.setReservedRate,
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
    dispatchFunction: creatingV2ProjectActions.setReservedTokensSplits,
    formatter: v => {
      if (v === undefined || typeof v !== 'object') return []
      return v.map(allocationToSplit)
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'discountRate',
    dispatchFunction: creatingV2ProjectActions.setDiscountRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return discountRateFrom(DefaultSettings.discountRate).toHexString()
      return discountRateFrom(v).toHexString()
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: creatingV2ProjectActions.setRedemptionRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return redemptionRateFrom(DefaultSettings.redemptionRate).toHexString()
      return redemptionRateFrom(v).toHexString()
    },
  })
  useFormDispatchWatch({
    form,
    fieldName: 'redemptionRate',
    dispatchFunction: creatingV2ProjectActions.setBallotRedemptionRate,
    formatter: v => {
      if (v === undefined || typeof v !== 'number')
        return redemptionRateFrom(DefaultSettings.redemptionRate).toHexString()
      return redemptionRateFrom(v).toHexString()
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'tokenMinting',
    dispatchFunction: creatingV2ProjectActions.setAllowMinting,
    formatter: v => {
      if (typeof v !== 'boolean') return false
      return v
    },
  })

  useFormDispatchWatch({
    form,
    fieldName: 'pauseTransfers',
    dispatchFunction: creatingV2ProjectActions.setPauseTransfers,
    ignoreUndefined: true,
    formatter: v => {
      if (typeof v !== 'boolean') return false
      return v
    },
  })

  return { form, initialValues }
}
