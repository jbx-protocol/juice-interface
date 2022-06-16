import { t, Trans } from '@lingui/macro'
import { Form, Modal, Radio, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import TooltipLabel from 'components/shared/TooltipLabel'
import { useState } from 'react'
import { fromWad } from 'utils/formatNumber'
import { MAX_DISTRIBUTION_LIMIT } from 'utils/v2/math'

import { CurrencyName } from 'constants/currency'
import { DistributionType } from '.'

type LimitType = 'infinite' | 'specific'

export default function SpecificLimitModal({
  visible,
  onClose,
  setDistributionLimit,
  setDistributionType,
  currencyName,
  onCurrencyChange,
  initialDistributionType,
}: {
  visible: boolean
  onClose: VoidFunction
  setDistributionLimit: (distributionLimit: string) => void
  setDistributionType: (distributionType: DistributionType) => void
  currencyName: CurrencyName
  onCurrencyChange: (currencyName: CurrencyName) => void
  initialDistributionType: DistributionType
}) {
  const [form] = useForm<{ distributionLimit: string }>()

  const [limitType, setLimitType] = useState<LimitType>('infinite')

  function setNewSplitsFromLimit() {
    form.validateFields()

    setDistributionLimit(form.getFieldValue('distributionLimit'))
    onClose()
    if (initialDistributionType === 'amount') {
      setDistributionType('percent')
    } else {
      setDistributionType('amount')
    }
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
        {initialDistributionType === 'amount' ? (
          <Radio.Group
            onChange={e => {
              const newType = e.target.value
              if (newType === 'infinite') {
                form.setFieldsValue({
                  distributionLimit: fromWad(MAX_DISTRIBUTION_LIMIT),
                })
              }
              setLimitType(newType)
            }}
            value={limitType}
          >
            <Space direction="vertical">
              <Radio value="infinite">
                <Trans>Infinite limit</Trans>
                <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                  <Trans>
                    Any funds that enter the treasury can be distributed.
                  </Trans>
                </p>
              </Radio>
              <Radio value="specific">
                <Trans>Percentages</Trans>
                <p style={{ fontWeight: 400, fontSize: '0.8rem' }}>
                  <Trans>
                    Distribute a percentage of an overall distribution limit to
                    entities.
                  </Trans>
                </p>
              </Radio>
            </Space>
          </Radio.Group>
        ) : null}
        {limitType !== 'infinite' ? (
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
                <>
                  {initialDistributionType === 'percent' ? (
                    <TooltipLabel
                      label={t`Set this to the sum of all your payouts`}
                      tip={
                        <Trans>
                          Each payout will receive their percent of this total
                          each funding cycle if there is enough in the treasury.
                          Otherwise, they will receive their percent of whatever
                          is in the treasury.
                        </Trans>
                      }
                    />
                  ) : (
                    t`Distribution limit`
                  )}
                </>
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
        ) : null}
      </Form>
    </Modal>
  )
}
