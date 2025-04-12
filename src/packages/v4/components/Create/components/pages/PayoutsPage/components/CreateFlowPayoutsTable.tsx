import { BigNumber } from '@ethersproject/bignumber'
import { Form } from 'antd'
import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'
import { TreasurySelection } from 'models/treasurySelection'
import { Split } from 'packages/v2v3/models/splits'
import {
  V2V3CurrencyName,
  getV2V3CurrencyOption,
} from 'packages/v2v3/utils/currency'
import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import { PayoutsTable } from 'packages/v4/components/PayoutsTable/PayoutsTable'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { ReactNode } from 'react'
import { useCreatingDistributionLimit } from 'redux/hooks/v2v3/create'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { usePayoutsForm } from '../hooks/usePayoutsForm'

const DEFAULT_CURRENCY_NAME = CURRENCY_METADATA.ETH.name

export function CreateFlowPayoutsTable({
  onFinish,
  topAccessory,
  okButton,
  addPayoutsDisabled,
  createTreasurySelection,
}: {
  onFinish?: VoidFunction
  okButton?: ReactNode
  topAccessory?: ReactNode
  addPayoutsDisabled?: boolean
  // TODO: Hack to allow payout recipients to be shown on review but not on create page
  // When zero, hides the recipients, but undefined still shows them
  createTreasurySelection?: TreasurySelection
}) {
  const [
    creatingDistributionLimit,
    ,
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ] = useCreatingDistributionLimit()

  const { form, initialValues } = usePayoutsForm()
  const distributionLimit = !creatingDistributionLimit
    ? 0
    : creatingDistributionLimit.amount.eq(MAX_PAYOUT_LIMIT)
    ? undefined
    : parseFloat(fromWad(creatingDistributionLimit?.amount))

  const splits: Split[] =
    form.getFieldValue('payoutsList')?.map(allocationToSplit) ?? []

  const setDistributionLimit = (amount: number | undefined) => {
    setDistributionLimitAmount(
      amount === undefined
        ? BigNumber.from(MAX_PAYOUT_LIMIT)
        : parseWad(amount),
    )
  }
  const setCurrency = (currency: CurrencyName) => {
    setDistributionLimitCurrency(getV2V3CurrencyOption(currency))
  }

  const setSplits = (splits: Split[]) => {
    form.setFieldsValue({ payoutsList: splits.map(splitToAllocation) })
  }

  return (
    <Form form={form} initialValues={initialValues} onFinish={onFinish}>
      <PayoutsTable
        payoutSplits={splits}
        setPayoutSplits={setSplits}
        currency={
          V2V3CurrencyName(creatingDistributionLimit?.currency) ??
          DEFAULT_CURRENCY_NAME
        }
        setCurrency={setCurrency}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        topAccessory={topAccessory}
        hideExplaination
        hideSettings
        addPayoutsDisabled={addPayoutsDisabled}
        createTreasurySelection={createTreasurySelection}
      />
      {/* Empty form item just to keep AntD useWatch happy */}
      <Form.Item shouldUpdate name="payoutsList" className="mb-0" />
      {okButton}
    </Form>
  )
}
