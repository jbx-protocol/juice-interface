import { AddressZero } from '@ethersproject/constants'
import { ETH_TOKEN_ADDRESS } from 'constants/juiceboxTokens'
import { BigNumber } from 'ethers'
import { useDefaultJBETHPaymentTerminal } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { Split } from 'packages/v2v3/models/splits'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import {
  deserializeFundAccessConstraint,
  deserializeV2V3FundingCycleData,
  deserializeV2V3FundingCycleMetadata,
} from 'packages/v2v3/utils/serializers'
import { useCallback, useMemo } from 'react'
import { shallowEqual } from 'react-redux'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { creatingV2ProjectActions } from 'redux/slices/creatingV2Project'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { useAppSelector } from '../useAppSelector'
import { ReduxDistributionLimit } from './shared'

export const useCreatingV2V3FundingCycleMetadataSelector = () => {
  const serializedFundingCycleMetadata = useAppSelector(
    state => state.creatingV2Project.fundingCycleMetadata,
    shallowEqual,
  )

  const fundingCycleMetadata = useMemo(
    () => deserializeV2V3FundingCycleMetadata(serializedFundingCycleMetadata),
    [serializedFundingCycleMetadata],
  )

  // force useDataSourceForPay to false, for safety.
  // https://github.com/jbx-protocol/juice-interface/issues/1473
  fundingCycleMetadata.useDataSourceForPay = false

  return fundingCycleMetadata
}

export const useCreatingV2V3FundingCycleDataSelector = () => {
  const serializedFundingCycleData = useAppSelector(
    state => state.creatingV2Project.fundingCycleData,
    shallowEqual,
  )

  const fundingCycleData = useMemo(
    () => deserializeV2V3FundingCycleData(serializedFundingCycleData),
    [serializedFundingCycleData],
  )

  return fundingCycleData
}

export const useCreatingV2V3FundAccessConstraintsSelector = () => {
  const serializedFundAccessConstraints = useAppSelector(
    state => state.creatingV2Project.fundAccessConstraints,
    shallowEqual,
  )

  const fundAccessConstraints = useMemo(
    () =>
      serializedFundAccessConstraints.map(d =>
        deserializeFundAccessConstraint(d),
      ),
    [serializedFundAccessConstraints],
  )

  return fundAccessConstraints
}

/**
 * Hook for accessing and setting the redux creating v2 distribution limit value
 * in fundingAccessConstraint.
 * @returns
 */
export const useCreatingDistributionLimit = (): [
  ReduxDistributionLimit | undefined,
  (input: ReduxDistributionLimit | undefined) => void,
  (amount: BigNumber) => void,
  (currency: V2V3CurrencyOption) => void,
] => {
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()
  const dispatch = useAppDispatch()
  const fundAccessConstraints = useAppSelector(
    state => state.creatingV2Project.fundAccessConstraints,
  )

  const distributionLimit: ReduxDistributionLimit | undefined = useMemo(() => {
    if (
      !fundAccessConstraints.length ||
      !fundAccessConstraints?.[0].distributionLimit?.length
    ) {
      return undefined
    }
    const distributionLimit = parseWad(
      fundAccessConstraints[0].distributionLimit,
    )
    const distributionLimitCurrency = (parseInt(
      fundAccessConstraints[0].distributionLimitCurrency,
    ) ?? V2V3_CURRENCY_ETH) as V2V3CurrencyOption

    return { amount: distributionLimit, currency: distributionLimitCurrency }
  }, [fundAccessConstraints])

  const setDistributionLimit = useCallback(
    (input: ReduxDistributionLimit | undefined) => {
      if (!input) {
        dispatch(creatingV2ProjectActions.setFundAccessConstraints([]))
        return
      }
      const distributionLimitCurrency = input.currency.toString()
      dispatch(
        creatingV2ProjectActions.setFundAccessConstraints([
          {
            terminal: defaultJBETHPaymentTerminal?.address ?? AddressZero,
            token: ETH_TOKEN_ADDRESS,
            distributionLimit: fromWad(input.amount),
            distributionLimitCurrency,
            overflowAllowance: '0',
            overflowAllowanceCurrency: '0',
          },
        ]),
      )
    },
    [defaultJBETHPaymentTerminal, dispatch],
  )

  const setDistributionLimitAmount = useCallback(
    (input: BigNumber) => {
      const currentFundAccessConstraint = fundAccessConstraints?.[0] ?? {
        terminal: defaultJBETHPaymentTerminal?.address ?? AddressZero,
        token: ETH_TOKEN_ADDRESS,
        distributionLimitCurrency: V2V3_CURRENCY_ETH.toString(),
        overflowAllowance: '0',
        overflowAllowanceCurrency: '0',
      }
      dispatch(
        creatingV2ProjectActions.setFundAccessConstraints([
          {
            ...currentFundAccessConstraint,
            distributionLimit: fromWad(
              input === undefined ? MAX_DISTRIBUTION_LIMIT : input,
            ),
          },
        ]),
      )
    },
    [defaultJBETHPaymentTerminal, dispatch, fundAccessConstraints],
  )

  const setDistributionLimitCurrency = useCallback(
    (input: V2V3CurrencyOption) => {
      dispatch(
        creatingV2ProjectActions.setDistributionLimitCurrency(input.toString()),
      )
    },
    [dispatch],
  )

  return [
    distributionLimit,
    setDistributionLimit,
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ]
}

/**
 * Hook for accessing and setting the redux creating v2 payout splits value.
 */
export const useCreatingPayoutSplits = (): [
  Split[],
  (input: Split[]) => void,
] => {
  const dispatch = useAppDispatch()
  const { splits } = useAppSelector(
    state => state.creatingV2Project.payoutGroupedSplits,
  )

  const setSplits = useCallback(
    (input: Split[]) => {
      if (!input || !input.length) {
        dispatch(creatingV2ProjectActions.setPayoutSplits([]))
        return
      }
      dispatch(creatingV2ProjectActions.setPayoutSplits(input))
    },
    [dispatch],
  )

  return [splits, setSplits]
}

/**
 * Hook for accessing and setting the redux creating v2 reserved token splits value.
 */
export const useCreatingReservedTokensSplits = (): [
  Split[],
  (input: Split[]) => void,
] => {
  const dispatch = useAppDispatch()
  const { splits } = useAppSelector(
    state => state.creatingV2Project.reservedTokensGroupedSplits,
  )

  const setSplits = useCallback(
    (input: Split[]) => {
      if (!input || !input.length) {
        dispatch(creatingV2ProjectActions.setReservedTokensSplits([]))
        return
      }
      dispatch(creatingV2ProjectActions.setReservedTokensSplits(input))
    },
    [dispatch],
  )

  return [splits, setSplits]
}
