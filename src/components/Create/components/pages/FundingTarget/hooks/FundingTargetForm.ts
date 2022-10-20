import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { CurrencySelectInputValue } from 'components/Create/components/CurrencySelectInput'
import { FundingTargetType } from 'models/fundingTargetType'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export type FundingTargetFormProps = Partial<{
  targetSelection: FundingTargetType
  amount: CurrencySelectInputValue
}>

export const useFundingTargetForm = () => {
  const [form] = Form.useForm<FundingTargetFormProps>()
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  useDebugValue(form.getFieldsValue())

  const initialValues: FundingTargetFormProps | undefined = useMemo(() => {
    if (!distributionLimit) {
      return undefined
    }

    let targetSelection: FundingTargetType

    if (distributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)) {
      targetSelection = 'infinite'
    } else {
      targetSelection = 'specific'
    }

    const currency =
      distributionLimit.currency === V2V3_CURRENCY_ETH ? 'eth' : 'usd'

    return {
      targetSelection,
      amount: { amount: fromWad(distributionLimit.amount), currency },
    }
  }, [distributionLimit])

  const targetSelection = useWatch('targetSelection', form)
  const amount = useWatch('amount', form)

  useEffect(() => {
    if (targetSelection === 'infinite') {
      setDistributionLimit({
        amount: MAX_DISTRIBUTION_LIMIT,
        currency: V2V3_CURRENCY_ETH,
      })
      return
    }

    if (!targetSelection || amount?.amount === undefined) {
      setDistributionLimit(undefined)
      return
    }
    if (targetSelection === 'specific') {
      setDistributionLimit({
        amount: parseWad(amount.amount),
        currency:
          amount.currency === 'eth' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD,
      })
      return
    }
  }, [amount?.amount, amount?.currency, setDistributionLimit, targetSelection])

  return { form, initialValues }
}
