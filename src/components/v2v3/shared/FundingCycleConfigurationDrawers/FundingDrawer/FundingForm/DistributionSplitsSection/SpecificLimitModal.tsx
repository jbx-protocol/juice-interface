import { t, Trans } from '@lingui/macro'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TooltipLabel from 'components/TooltipLabel'

import { CurrencyName } from 'constants/currency'

export default function SpecificLimitModal({
  open,
  onClose,
  setDistributionLimit,
  currencyName,
  onCurrencyChange,
}: {
  open: boolean
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
      open={open}
      onCancel={onClose}
      title={
        <TooltipLabel
          label={t`Set up your payouts`}
          tip={t`This is the amount of funds that you can pay out from your project each cycle.`}
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
              label={t`Set this to the sum of your payouts`}
              tip={
                <Trans>
                  If there is enough ETH available, each recipient will receive
                  their percent of this amount each cycle. Otherwise, they will
                  receive their percent of whatever is available.
                </Trans>
              }
            />
          }
        >
          <FormattedNumberInput
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
