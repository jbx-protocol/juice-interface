import { Form } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { FundingTargetType } from 'models/fundingTargetType'
import { useDebugValue, useEffect, useMemo } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/EditingDistributionLimit'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'

export type FundingTargetFormProps = Partial<{
  targetSelection: FundingTargetType
  amount: {
    amount: string
    currency: 'eth' | 'usd'
  }
}>

export const useFundingTargetForm = () => {
  const [form] = Form.useForm<FundingTargetFormProps>()
  const [distributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()
  const { fundingTargetSelection } = useAppSelector(
    state => state.editingV2Project,
  )
  useDebugValue(form.getFieldsValue())

  const initialValues: FundingTargetFormProps | undefined = useMemo(() => {
    const selection = fundingTargetSelection

    const currency =
      distributionLimit?.currency === V2V3_CURRENCY_ETH ? 'eth' : 'usd'
    let amount: {
      amount: string
      currency: 'eth' | 'usd'
    } = { amount: '0', currency }

    if (distributionLimit) {
      if (distributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)) {
        amount = { amount: '0', currency }
      } else {
        amount = {
          currency,
          amount: fromWad(distributionLimit.amount),
        }
      }
    }

    return { amount, targetSelection: selection }
  }, [distributionLimit, fundingTargetSelection])

  const dispatch = useAppDispatch()
  const targetSelection = useWatch('targetSelection', form)
  const amount = useWatch('amount', form)

  useEffect(() => {
    dispatch(editingV2ProjectActions.setFundingTargetSelection(targetSelection))
    if (targetSelection === 'infinite') {
      setDistributionLimit({
        amount: MAX_DISTRIBUTION_LIMIT,
        currency: V2V3_CURRENCY_ETH,
      })
      return
    }

    if (!targetSelection) {
      setDistributionLimit(undefined)
      return
    }
    if (targetSelection === 'specific') {
      setDistributionLimit({
        amount:
          amount?.amount !== undefined ? parseWad(amount.amount) : parseWad(0),
        currency:
          amount?.currency !== undefined && amount.currency === 'usd'
            ? V2V3_CURRENCY_USD
            : V2V3_CURRENCY_ETH,
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
