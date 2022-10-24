import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { FormItemInput } from 'models/formItemInput'
import { FundingTargetType } from 'models/fundingTargetType'
import { useContext, useEffect } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateCallout } from '../../CreateCallout'
import { CurrencySelectInputValue } from '../../CurrencySelectInput'
import { Icons } from '../../Icons'
import { RecallCard } from '../../RecallCard'
import { Selection } from '../../Selection'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { currencyAmountMustExistRuleionMustExistRule } from '../utils/rules/currencyAmountMustExistRule'
import { useFundingTargetForm } from './hooks'

export const FundingTargetPage: React.FC = () => {
  useSetCreateFurthestPageReached('fundingTarget')
  const { goToNextPage, lockPageProgress, unlockPageProgress } =
    useContext(PageContext)
  const { form, initialValues } = useFundingTargetForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()

  const selection = useWatch('targetSelection', form)
  const isNextEnabled = !!selection

  // A bit of a workaround to soft lock the page when the user edits data.
  useEffect(() => {
    if (!selection) {
      lockPageProgress?.()
      return
    }
    if (selection === 'specific') {
      const amount = form.getFieldValue('amount')
      if (amount?.amount === undefined) {
        lockPageProgress?.()
        return
      }
    }
    unlockPageProgress?.()
  }, [form, isNextEnabled, lockPageProgress, selection, unlockPageProgress])

  return (
    <Form
      form={form}
      initialValues={initialValues}
      name="fundingTarget"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <RecallCard show={['fundingCycles']} />
        <Form.Item noStyle name="targetSelection">
          <Selection defocusOnSelect style={{ width: '100%' }}>
            <Selection.Card
              name="specific"
              title={t`Specific Funding Target`}
              icon={<Icons.Target />}
              description={
                <Trans>
                  Set a specific amount to distribute to nominated addresses
                  each funding cycle.
                </Trans>
              }
            >
              <Form.Item
                name="amount"
                label={t`Set your funding target`}
                rules={lockPageRulesWrapper([
                  currencyAmountMustExistRuleionMustExistRule({
                    label: t`Funding Target`,
                  }),
                ])}
              >
                <FormattedNumberInputWrapper />
              </Form.Item>
            </Selection.Card>
            <Selection.Card
              name="infinite"
              title={t`Infinite Funding Target`}
              icon={<Icons.Infinity />}
              description={
                <Trans>
                  Your project will withhold all funds raised. Funds can be
                  distributed to payout addresses you set, and the project owner
                  will receive any unallocated funds. Your project will have no
                  overflow, so token holders can't redeem their tokens for ETH.
                </Trans>
              }
            />
          </Selection>
        </Form.Item>
        {selection ? <TargetCallout selection={selection} /> : null}
        <Wizard.Page.ButtonControl isNextEnabled={isNextEnabled} />
      </Space>
    </Form>
  )
}

const FormattedNumberInputWrapper: React.FC<
  FormItemInput<CurrencySelectInputValue>
> = props => {
  const currency = props.value?.currency ?? 'eth'
  return (
    <FormattedNumberInput
      value={props.value?.amount}
      onChange={amount => props.onChange?.({ amount, currency })}
      accessory={
        <InputAccessoryButton
          withArrow
          content={currency === 'eth' ? 'ETH' : 'USD'}
          onClick={() =>
            props.onChange?.({
              amount: props.value?.amount ?? '0',
              currency: currency === 'eth' ? 'usd' : 'eth',
            })
          }
        />
      }
    />
  )
}

const TargetCallout = ({ selection }: { selection: FundingTargetType }) => {
  let calloutText = undefined
  switch (selection) {
    case 'infinite':
      calloutText = t`Having an Infinite Funding Target means contributors WILL NOT be able to redeem their tokens for a portion of the treasury funds. Payout splits will be nominated in percentages only.`
      break
    case 'specific':
      calloutText = t`Your Funding Target can be changed in future funding cycles. USD amounts will be paid out in ETH, this conversion will be resolved at moment of distribution.`
      break
  }
  return calloutText ? (
    <CreateCallout.Info>{calloutText}</CreateCallout.Info>
  ) : null
}
