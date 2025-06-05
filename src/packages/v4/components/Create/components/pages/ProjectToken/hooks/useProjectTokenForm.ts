import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import {
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
  useCreatingDistributionLimit,
  useCreatingReservedTokensSplits,
} from 'redux/hooks/v2v3/create'
import { useDebugValue, useEffect, useMemo } from 'react'

import { AllocationSplit } from 'packages/v2v3/components/shared/Allocation/Allocation'
import { Form } from 'antd'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { ProjectTokensSelection } from 'models/projectTokenSelection'
import { creatingV2ProjectActions } from 'redux/slices/v2v3/creatingV2Project'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { useFormDispatchWatch } from '../../hooks/useFormDispatchWatch'
import { useWatch } from 'antd/lib/form/Form'

export type ProjectTokensFormProps = Partial<{
  selection: ProjectTokensSelection
  initialMintRate: string | undefined
  reservedTokensPercentage: number | undefined
  reservedTokenAllocation: AllocationSplit[] | undefined
  discountRate: number | undefined
  // In v4 this is supposed to be called cashOutTaxRate
  // redemptionRate is wrong because redemptionRate actually equals (100 - cashOutTaxRate)
  redemptionRate: number | undefined
  enableCashOuts: boolean | undefined
  tokenMinting: boolean | undefined
  pauseTransfers: boolean | undefined
}>

export const DefaultSettings: Required<
  Omit<ProjectTokensFormProps, 'selection'>
> = {
  initialMintRate: "0",
  reservedTokensPercentage: 0,
  reservedTokenAllocation: [],
  discountRate: 0,
  redemptionRate: 100,
  enableCashOuts: false,
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

  const cashOutTaxRateDisabled =
    !distributionLimit || distributionLimit.amount.eq(MAX_PAYOUT_LIMIT)
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
    
    // redemptionRate is referred to cashOutTaxRate in other places, it actually means cashOutRate here
    const redemptionRate =
      !cashOutTaxRateDisabled && fundingCycleMetadata.redemptionRate
        ? parseFloat(formatRedemptionRate(fundingCycleMetadata.redemptionRate))
        : DefaultSettings.redemptionRate

        const enableCashOuts =
      fundingCycleMetadata.redemptionRate !== undefined
        ? redemptionRate !== 100
        : DefaultSettings.enableCashOuts

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
      enableCashOuts,
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
    cashOutTaxRateDisabled,
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
