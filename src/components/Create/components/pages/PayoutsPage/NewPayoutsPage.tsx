import { Form } from 'antd'
import PayoutsTable from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/NewEditCyclePage/PayoutsSection/PayoutsTable'
import { CURRENCY_METADATA, CurrencyName } from 'constants/currency'
import { BigNumber } from 'ethers'
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
import { usePayoutsForm } from './hooks'

const DEFAULT_DISTRIBUTION_LIMIT = BigNumber.from(0)
const DEFAULT_CURRENCY_NAME = CURRENCY_METADATA.ETH.name

export const NewPayoutsPage = () => {
  useSetCreateFurthestPageReached('payouts')
  const { goToNextPage } = useContext(PageContext)

  const [editingDistributionLimit, setDistributionLimit] =
    useEditingDistributionLimit()

  const { form, initialValues } = usePayoutsForm()

  const distributionLimit = !editingDistributionLimit
    ? 0
    : editingDistributionLimit.amount.eq(MAX_DISTRIBUTION_LIMIT)
    ? undefined
    : parseFloat(fromWad(editingDistributionLimit?.amount))

  const splits: Split[] =
    form.getFieldValue('payoutsList')?.map(allocationToSplit) ?? []

  const setDistributionLimitAmount = (amount: number | undefined) => {
    setDistributionLimit({
      amount: amount ? parseWad(amount) : MAX_DISTRIBUTION_LIMIT,
      currency:
        editingDistributionLimit?.currency ??
        getV2V3CurrencyOption(DEFAULT_CURRENCY_NAME),
    })
  }

  const setDistributionLimitCurrency = (currency: CurrencyName) => {
    setDistributionLimit({
      amount: editingDistributionLimit?.amount ?? DEFAULT_DISTRIBUTION_LIMIT,
      currency: getV2V3CurrencyOption(currency),
    })
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
        setCurrency={setDistributionLimitCurrency}
        distributionLimit={distributionLimit}
        setDistributionLimit={setDistributionLimitAmount}
      />
      {/* Empty form item just to keep AntD useWatch happy */}
      <Form.Item shouldUpdate name="payoutsList" className="mb-0" />
      <Wizard.Page.ButtonControl />
    </Form>
  )
}
