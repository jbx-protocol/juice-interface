import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { CurrencySelectInputValue } from 'components/Create/components/CurrencySelectInput'
import { ETH_TOKEN_ADDRESS } from 'constants/v2/juiceboxTokens'
import { V2ContractsContext } from 'contexts/v2/V2ContractsContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import {
  useCallback,
  useContext,
  useDebugValue,
  useEffect,
  useMemo,
} from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

type TargetSelection = 'specific' | 'infinite' | 'none'

export type FundingTargetFormProps = Partial<{
  targetSelection: TargetSelection
  amount: CurrencySelectInputValue
}>

const useSetDistributionLimit = () => {
  const { contracts } = useContext(V2ContractsContext)
  const dispatch = useAppDispatch()
  return useCallback(
    (input: { amount: BigNumber; currency: 'eth' | 'usd' } | undefined) => {
      if (!contracts) return
      if (!input) {
        dispatch(editingV2ProjectActions.setFundAccessConstraints([]))
        return
      }
      const distributionLimitCurrency = (
        input.currency === 'eth' ? V2_CURRENCY_ETH : V2_CURRENCY_USD
      ).toString()
      dispatch(
        editingV2ProjectActions.setFundAccessConstraints([
          {
            terminal: contracts.JBETHPaymentTerminal.address,
            token: ETH_TOKEN_ADDRESS,
            distributionLimit: input.amount.toString(),
            distributionLimitCurrency,
            overflowAllowance: '0',
            overflowAllowanceCurrency: '0',
          },
        ]),
      )
    },
    [contracts, dispatch],
  )
}

export const useFundingTargetForm = () => {
  const [form] = Form.useForm<FundingTargetFormProps>()
  const { fundAccessConstraints } = useAppSelector(
    state => state.editingV2Project,
  )
  const setDistributionLimit = useSetDistributionLimit()
  useDebugValue(form.getFieldsValue())

  const initialValues: FundingTargetFormProps | undefined = useMemo(() => {
    if (
      !fundAccessConstraints.length ||
      !fundAccessConstraints?.[0].distributionLimit.length
    ) {
      return undefined
    }

    let targetSelection: TargetSelection

    const distributionLimit = BigNumber.from(
      fundAccessConstraints[0].distributionLimit,
    )
    if (distributionLimit.eq(MAX_DISTRIBUTION_LIMIT)) {
      targetSelection = 'infinite'
    } else if (distributionLimit.eq(0)) {
      targetSelection = 'none'
    } else {
      targetSelection = 'specific'
    }

    const distributionLimitCurrency = (parseInt(
      fundAccessConstraints[0].distributionLimitCurrency,
    ) ?? V2_CURRENCY_ETH) as V2CurrencyOption
    const currency =
      distributionLimitCurrency === V2_CURRENCY_ETH ? 'eth' : 'usd'

    return {
      targetSelection,
      amount: { amount: distributionLimit.toString(), currency },
    }
  }, [fundAccessConstraints])

  const dispatch = useAppDispatch()
  const targetSelection = useWatch('targetSelection', form)
  const amount = useWatch('amount', form)

  useEffect(() => {
    if (targetSelection === 'infinite') {
      setDistributionLimit({
        amount: MAX_DISTRIBUTION_LIMIT,
        currency: 'eth',
      })
      return
    }
    if (targetSelection === 'none') {
      setDistributionLimit({
        amount: BigNumber.from('0'),
        currency: 'eth',
      })
      return
    }

    if (!targetSelection || amount?.amount === undefined) {
      setDistributionLimit(undefined)
      return
    }
    if (targetSelection === 'specific') {
      setDistributionLimit({
        amount: BigNumber.from(amount.amount),
        currency: amount.currency,
      })
      return
    }
  }, [
    amount?.amount,
    amount?.currency,
    dispatch,
    setDistributionLimit,
    targetSelection,
  ])

  return { form, initialValues }
}
