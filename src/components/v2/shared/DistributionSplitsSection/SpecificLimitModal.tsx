import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInputNew from 'components/inputs/FormattedNumberInputNew'
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
        <Form.Item
          name="distributionLimit"
          rules={[
            {
              required: true,
              validator: (rule, value: string) => {
                if (!value.match(/^[\d,]+$/g)) {
                  return Promise.reject()
                }
              },
            },
          ]}
          extra={
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
          }
        >
          <FormattedNumberInputNew
            placeholder="0"
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow
                content={currencyName}
                onClick={toggleCurrency}
              />
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
