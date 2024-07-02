import { INFINITE_DISTRIBUTION_LIMIT_VALUE } from 'components/Create/components/pages/PayoutsPage/components/TreasuryOptionsRadio'
import { ETH_TOKEN_ADDRESS } from 'packages/v2v3/constants/juiceboxTokens'
import { useDefaultJBETHPaymentTerminal } from 'packages/v2v3/hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad, parseWad } from 'utils/format/formatNumber'

export interface ReduxDistributionLimit {
  amount: bigint
  currency: V2V3CurrencyOption | undefined
}

/**
 * Hook for accessing and setting the redux editing v2 distribution limit value
 * in fundingAccessConstraint.
 * @returns
 */
export const useEditingDistributionLimit = (): [
  ReduxDistributionLimit | undefined,
  (input: ReduxDistributionLimit | undefined) => void,
  (amount: bigint) => void,
  (currency: V2V3CurrencyOption) => void,
] => {
  const defaultJBETHPaymentTerminal = useDefaultJBETHPaymentTerminal()
  const dispatch = useAppDispatch()
  const fundAccessConstraints = useAppSelector(
    state => state.editingV2Project.fundAccessConstraints,
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
      if (!defaultJBETHPaymentTerminal) return
      if (!input) {
        dispatch(editingV2ProjectActions.setFundAccessConstraints([]))
        return
      }
      const distributionLimitCurrency =
        input.currency?.toString() ?? V2V3_CURRENCY_ETH.toString()

      dispatch(
        editingV2ProjectActions.setFundAccessConstraints([
          {
            // from ethers v5 to v6 migration: https://github.com/ethers-io/ethers.js/discussions/4312#discussioncomment-8398867
            terminal: defaultJBETHPaymentTerminal.target as string,
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
    (input: bigint) => {
      if (!defaultJBETHPaymentTerminal) return

      const currentFundAccessConstraint = fundAccessConstraints?.[0] ?? {
        terminal: defaultJBETHPaymentTerminal?.target,
        token: ETH_TOKEN_ADDRESS,
        distributionLimitCurrency: V2V3_CURRENCY_ETH.toString(),
        overflowAllowance: '0',
        overflowAllowanceCurrency: '0',
      }
      dispatch(
        editingV2ProjectActions.setFundAccessConstraints([
          {
            ...currentFundAccessConstraint,
            distributionLimit: fromWad(
              input === INFINITE_DISTRIBUTION_LIMIT_VALUE
                ? MAX_DISTRIBUTION_LIMIT
                : input,
            ),
          },
        ]),
      )
    },
    [defaultJBETHPaymentTerminal, dispatch, fundAccessConstraints],
  )

  const setDistributionLimitCurrency = useCallback(
    (input: V2V3CurrencyOption) => {
      if (!defaultJBETHPaymentTerminal) return
      dispatch(
        editingV2ProjectActions.setDistributionLimitCurrency(input.toString()),
      )
    },
    [defaultJBETHPaymentTerminal, dispatch],
  )

  return [
    distributionLimit,
    setDistributionLimit,
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ]
}
