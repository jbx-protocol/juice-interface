import { Form } from 'antd'
import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
import { PayoutsTable } from 'packages/v2v3/components/shared/PayoutsTable/PayoutsTable'
import { Split } from 'packages/v2v3/models/splits'
import {
  V2V3CurrencyName,
  getV2V3CurrencyOption,
} from 'packages/v2v3/utils/currency'
import {
  allocationToSplit,
  splitToAllocation,
} from 'packages/v2v3/utils/splitToAllocation'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { ReactNode } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { usePayoutsForm } from '../hooks/usePayoutsForm'

const DEFAULT_CURRENCY_NAME = CURRENCY_METADATA.ETH.name

export function CreateFlowPayoutsTable({
  onFinish,
  topAccessory,
  okButton,
  addPayoutsDisabled,
}: {
  onFinish?: VoidFunction
  okButton?: ReactNode
  topAccessory?: ReactNode
  addPayoutsDisabled?: boolean
}) {
  const [
    editingDistributionLimit,
    ,
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ] = useEditingDistributionLimit()

  const { form, initialValues } = usePayoutsForm()
  const distributionLimit = !editingDistributionLimit
    ? 0
    : editingDistributionLimit.amount.eq(MAX_PAYOUT_LIMIT)
    ? undefined
    : parseFloat(fromWad(editingDistributionLimit?.amount))

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
          V2V3CurrencyName(editingDistributionLimit?.currency) ??
          DEFAULT_CURRENCY_NAME
        }
        setCurrency={setCurrency}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimit}
        topAccessory={topAccessory}
        hideExplaination
        hideSettings
        addPayoutsDisabled={addPayoutsDisabled}
      />
      {/* Empty form item just to keep AntD useWatch happy */}
      <Form.Item shouldUpdate name="payoutsList" className="mb-0" />
      {okButton}
    </Form>
  )
}
