import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'

import { CurrencyName } from 'constants/currency'

export default function SpecificLimitModal({
  visible,
  onClose,
  setDistributionLimit,
  currencyName,
  onCurrencyChange,
}: {
  visible: boolean
  onClose: VoidFunction
  setDistributionLimit: (distributionLimit: string) => void
  currencyName: CurrencyName
  onCurrencyChange: (currencyName: CurrencyName) => void
}) {
  const [form] = useForm<{ distributionLimit: string }>()

  function setNewSplitsFromLimit() {
    form.validateFields()

    const distributionLimit = form
      .getFieldValue('distributionLimit')
      // Remove all commas from distribution limit
      .replace(/,/g, '')
    setDistributionLimit(distributionLimit)
    onClose()
  }

  const toggleCurrency = () => {
    const newCurrency = currencyName === 'ETH' ? 'USD' : 'ETH'
    onCurrencyChange(newCurrency)
  }

  return (
    <Modal
      visible={visible}
      onCancel={onClose}
      title={
        <TooltipLabel
          label={t`Set a distribution limit`}
          tip={t`This is the maximum amount of funds that can leave the treasury each funding cycle.`}
        />
      }
      onOk={setNewSplitsFromLimit}
    >
      <Form form={form}>
        <FormattedNumberInput
          placeholder="0"
          onChange={distributionLimit =>
            form.setFieldsValue({
              distributionLimit,
            })
          }
          name="distributionLimit"
          formItemProps={{
            rules: [{ required: true }],
            extra: (
              <TooltipLabel
                label={t`Set this to the sum of all your payouts`}
                tip={
                  <Trans>
                    Each payout will receive their percent of this total each
                    funding cycle if there is enough in the treasury. Otherwise,
                    they will receive their percent of whatever is in the
                    treasury.
                  </Trans>
                }
              />
            ),
          }}
          min={0}
          accessory={
            <InputAccessoryButton
              withArrow
              content={currencyName}
              onClick={toggleCurrency}
            />
          }
        />
      </Form>
    </Modal>
  )
}
