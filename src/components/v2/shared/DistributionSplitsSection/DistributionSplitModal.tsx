import { t } from '@lingui/macro'
import { Form, FormInstance, Modal } from 'antd'
import { ModalMode } from 'components/shared/formItems/formHelpers'
import { Split } from 'models/v2/splits'

import { AddOrEditSplitFormFields } from '.'

export default function DistributionSplitModal({
  visible,
  form,
  mode,
  splits,
  editingSplitIndex,
  distributionLimit,
  setEditingPercent,
  onOk,
  onCancel,
}: {
  visible: boolean
  form: FormInstance<AddOrEditSplitFormFields>
  mode: ModalMode // 'Add' or 'Edit' or 'Undefined'
  splits: Split[]
  editingSplitIndex: number | undefined
  distributionLimit: string | undefined
  setEditingPercent: (percent: number) => void
  onOk: VoidFunction
  onCancel: VoidFunction
}) {
  // // Validates the amount and percentage (ensures percent !== 0 or > 100)
  // const validatePayout = () => {
  //   return validatePercentage(form.getFieldValue('percent'))
  // }

  // // Validates new payout receiving address
  // const validatePayoutAddress = () => {
  //   return validateEthAddress(
  //     form.getFieldValue('beneficiary'),
  //     splits,
  //     mode,
  //     editingSplitIndex,
  //   )
  // }

  // const isPercentBeingRounded = () => {
  //   return countDecimalPlaces(form.getFieldValue('percent')) > 2
  // }

  // const roundedDownAmount = () => {
  //   const percent = roundDown(form.getFieldValue('percent'), 2)
  //   const targetSubFee = parseFloat(
  //     fromWad(amountSubFee(parseWad(target), feePerbicent)),
  //   )
  //   return parseFloat(((percent * targetSubFee) / 100).toFixed(4))
  // }

  // const onAmountChange = (newAmount: number) => {
  //   let newPercent = parseFloat(getDistributionPercentFromAmount({
  //     amount: newAmount, distributionLimit
  //   }))
  //   setEditingPercent(newPercent)
  //   form.setFieldsValue({ amount: newAmount })
  //   form.setFieldsValue({ percent: newPercent })
  // }

  return (
    <Modal
      title={mode === 'Edit' ? t`Edit existing split` : t`Add a payout`}
      visible={visible}
      onOk={onOk}
      okText={mode === 'Edit' ? t`Save split` : t`Add payout`}
      onCancel={onCancel}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onKeyDown={e => {
          if (e.key === 'Enter') onOk()
        }}
      >
        <Form.Item>
          {/* <Select value={editingSplitType} onChange={setEditingSplitType}>
            <Select.Option value="address">
              <Trans>Wallet address</Trans>
            </Select.Option>
            <Select.Option value="project">
              <Trans>Juicebox project</Trans>
            </Select.Option>
          </Select> */}
        </Form.Item>

        {/* {editingSplitType === 'address' ? (
          <FormItems.EthAddress
            name="beneficiary"
            defaultValue={form.getFieldValue('beneficiary')}
            formItemProps={{
              label: 'Address',
              rules: [
                {
                  validator: validatePayoutAddress,
                },
              ],
            }}
            onAddressChange={beneficiary =>
              form.setFieldsValue({ beneficiary })
            }
          />
        ) : (
          <FormItems.ProjectHandleFormItem
            name="handle"
            requireState="exists"
            initialValue={editingSplitProjectId}
            formItemProps={{
              label: t`Project handle`,
            }}
            required
          />
        )}
        {editingSplitType === 'project' ? (
          <FormItems.EthAddress
            name="beneficiary"
            defaultValue={form.getFieldValue('beneficiary')}
            formItemProps={{
              label: t`Address`,
              extra: t`The address that should receive the tokens minted from paying this project.`,
              rules: [
                {
                  validator: () => {
                    const address = form.getFieldValue('beneficiary')
                    if (!address || !isAddress(address))
                      return Promise.reject('Address is required')
                    else if (address === constants.AddressZero)
                      return Promise.reject('Cannot use zero address.')
                    else return Promise.resolve()
                  },
                },
              ],
            }}
            onAddressChange={beneficiary =>
              form.setFieldsValue({ beneficiary })
            }
          />
        ) : null} */}

        {/* Only show amount input if project has a funding target */}
        {/* {!targetIsInfinite ? (
          <Form.Item
            label="Amount"
            // Display message to user if the amount they inputted
            // will result in percentage with > 2 decimal places
            // and no error is present
            className="ant-form-item-extra-only"
            extra={
              isPercentBeingRounded() &&
              !(form.getFieldValue('percent') > 100) ? (
                <div>
                  Will be rounded to{' '}
                  <CurrencySymbol currency={currencyName} />
                  {roundedDownAmount()}
                </div>
              ) : null
            }
          >
            <div
              style={{
                display: 'flex',
                color: colors.text.primary,
                alignItems: 'center',
              }}
            >
              <FormattedNumberInput
                value={form.getFieldValue('amount')}
                placeholder={'0'}
                onChange={amount => onAmountChange(parseFloat(amount || '0'))}
                formItemProps={{
                  rules: [{ validator: validatePayout }],
                }}
                accessory={<InputAccessoryButton content={currencyName} />}
              />
            </div>
          </Form.Item>
        ) : null}

        <Form.Item label="Percent">
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>
              <NumberSlider
                onChange={(percent: number | undefined) => {
                  let newAmount = getAmountFromPercent(
                    percent ?? 0,
                    target,
                    feePercentage,
                  )
                  form.setFieldsValue({ amount: newAmount })
                  form.setFieldsValue({ percent })
                  setEditingPercent(percent)
                }}
                step={0.01}
                defaultValue={form.getFieldValue('percent') || 0}
                sliderValue={form.getFieldValue('percent')}
                suffix="%"
                name="percent"
                formItemProps={{
                  rules: [{ validator: validatePayout }],
                }}
              />
            </span>
          </div>
        </Form.Item>
        <Form.Item
          name="lockedUntil"
          label="Lock until"
          extra="If locked, this can't be edited or removed until the lock expires or the funding cycle is reconfigured."
        >
          <DatePicker />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
