import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { BigNumber } from 'ethers'
import { useDefaultJBETHPaymentTerminal } from 'hooks/defaultContracts/useDefaultJBETHPaymentTerminal'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useCallback, useMemo } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'
import { useAppSelector } from 'redux/hooks/useAppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'

export interface ReduxDistributionLimit {
  amount: BigNumber
  currency: V2V3CurrencyOption
}

/**
 * Hook for accessing and setting the redux editing v2 distribution limit value
 * in fundingAccessConstraint.
 * @returns
 */
export const useEditingDistributionLimit = (): [
  ReduxDistributionLimit | undefined,
  (input: ReduxDistributionLimit | undefined) => void,
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
      const distributionLimitCurrency = input.currency.toString()
      dispatch(
        editingV2ProjectActions.setFundAccessConstraints([
          {
            terminal: defaultJBETHPaymentTerminal?.address,
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

  return [distributionLimit, setDistributionLimit]
}
