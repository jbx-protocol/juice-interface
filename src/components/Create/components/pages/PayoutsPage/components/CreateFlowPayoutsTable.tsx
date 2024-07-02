import { Form } from 'antd'
import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { PayoutsTable } from 'packages/v2v3/components/shared/PayoutsTable/PayoutsTable'
import {
  V2V3CurrencyName,
  getV2V3CurrencyOption,
} from 'packages/v2v3/utils/currency'
import { isInfiniteDistributionLimit } from 'packages/v2v3/utils/fundingCycle'
import { MAX_DISTRIBUTION_LIMIT } from 'packages/v2v3/utils/math'
import { ReactNode } from 'react'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { usePayoutsForm } from '../hooks/usePayoutsForm'
import { INFINITE_DISTRIBUTION_LIMIT_VALUE } from './TreasuryOptionsRadio'

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
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ] = useEditingDistributionLimit()

  const { form, initialValues } = usePayoutsForm()
  const distributionLimit = !editingDistributionLimit
    ? 0
    : isInfiniteDistributionLimit(editingDistributionLimit.amount)
    ? undefined
    : parseFloat(fromWad(editingDistributionLimit?.amount))

  const splits: Split[] =
    form.getFieldValue('payoutsList')?.map(allocationToSplit) ?? []

  const setDistributionLimit = (amount: number | undefined) => {
    setDistributionLimitAmount(
      amount === INFINITE_DISTRIBUTION_LIMIT_VALUE
        ? MAX_DISTRIBUTION_LIMIT
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
