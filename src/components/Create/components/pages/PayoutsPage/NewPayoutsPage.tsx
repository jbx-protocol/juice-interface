import { Form } from 'antd'
import PayoutsTable from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/EditCyclePage/PayoutsSection/PayoutsTable'
import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'
import { Split } from 'models/splits'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { useEditingDistributionLimit } from 'redux/hooks/useEditingDistributionLimit'
import { fromWad, parseWad } from 'utils/format/formatNumber'
import { allocationToSplit, splitToAllocation } from 'utils/splitToAllocation'
import { V2V3CurrencyName, getV2V3CurrencyOption } from 'utils/v2v3/currency'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2v3/math'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { TreasuryOptionsRadio } from './components/TreasuryOptionsRadio'
import { usePayoutsForm } from './hooks'

const DEFAULT_CURRENCY_NAME = CURRENCY_METADATA.ETH.name

export const NewPayoutsPage = () => {
  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage } = useContext(PageContext)

  const [
    editingDistributionLimit,
    ,
    setDistributionLimitAmount,
    setDistributionLimitCurrency,
  ] = useEditingDistributionLimit()

  const { form, initialValues } = usePayoutsForm()
  const distributionLimit = !editingDistributionLimit
    ? 0
    : editingDistributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)
    ? undefined
    : parseFloat(fromWad(editingDistributionLimit?.amount))

  const splits: Split[] =
    form.getFieldValue('payoutsList')?.map(allocationToSplit) ?? []

  const setDistributionLimit = (amount: number | undefined) => {
    setDistributionLimitAmount(
      amount === undefined ? MAX_DISTRIBUTION_LIMIT : parseWad(amount),
    )
  }
  const setCurrency = (currency: CurrencyName) => {
    setDistributionLimitCurrency(getV2V3CurrencyOption(currency))
  }

  const setSplits = (splits: Split[]) => {
    form.setFieldsValue({ payoutsList: splits.map(splitToAllocation) })
  }

  return (
    <Form
      form={form}
      initialValues={initialValues}
      onFinish={() => {
        goToNextPage?.()
      }}
    >
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
        topAccessory={<TreasuryOptionsRadio />}
        hideExplaination
        hideSettings
      />
      {/* Empty form item just to keep AntD useWatch happy */}
      <Form.Item shouldUpdate name="payoutsList" className="mb-0" />
      <Wizard.Page.ButtonControl />
    </Form>
  )
}
