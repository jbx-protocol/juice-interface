import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, Modal, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import {
  ModalMode,
  validateEthAddress,
  validatePercentage,
} from 'components/shared/formItems/formHelpers'
import { isAddress } from 'ethers/lib/utils'
import { Split } from 'models/v2/splits'
import { useContext, useState } from 'react'
import { parseWad, percentToPermyriad } from 'utils/formatNumber'
import { getDistributionPercentFromAmount } from 'utils/v2/distributions'
import * as constants from '@ethersproject/constants'
import { ThemeContext } from 'contexts/themeContext'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'

import { CurrencyName } from 'constants/currency'

export type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  amount: number
  lockedUntil: moment.Moment
}

type SplitType = 'project' | 'address'

export default function DistributionSplitModal({
  visible,
  mode,
  splits,
  onSplitsChanged,
  distributionLimit,
  splitIndex, // Only in the case mode==='Edit'
  onClose,
  currencyName,
}: {
  visible: boolean
  mode: ModalMode // 'Add' or 'Edit' or 'Undefined'
  splits: Split[]
  onSplitsChanged: (splits: Split[]) => void
  distributionLimit: string | undefined
  splitIndex?: number
  onClose: VoidFunction
  currencyName: CurrencyName
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [editingSplitType, setEditingSplitType] = useState<SplitType>('address')

  const [form] = useForm<AddOrEditSplitFormFields>()

  // const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  // const feePercentage = ETHPaymentTerminalFee
  //   ? formatFee(ETHPaymentTerminalFee)
  //   : undefined

  // Validates new or newly edited split, then adds it to or edits the splits list
  const setSplit = async () => {
    await form.validateFields()

    const handle = form.getFieldValue('handle')
    const beneficiary = form.getFieldValue('beneficiary')
    const percent = percentToPermyriad(form.getFieldValue('percent')).toNumber()
    const _lockedUntil = form.getFieldValue('lockedUntil') as moment.Moment

    const lockedUntil = _lockedUntil
      ? Math.round(_lockedUntil.valueOf() / 1000)
      : undefined

    // Store handle in mod object only to repopulate handle input while editing
    const newSplit = {
      beneficiary,
      percent,
      handle,
      lockedUntil,
      preferClaimed: true,
      projectId: undefined,
      allocator: undefined,
    }

    onSplitsChanged(
      mode === 'Edit' //editingSplitIndex !== undefined && editingSplitIndex < splits.length
        ? splits.map((m, i) =>
            i === splitIndex
              ? {
                  ...m,
                  ...newSplit,
                }
              : m,
          )
        : [...splits, newSplit],
    )

    // form.resetFields()
    onClose()
  }

  // const roundedDownAmount = () => {
  //   const percent = roundDown(form.getFieldValue('percent'), 2)
  //   // const targetSubFee = parseFloat(
  //   //   fromWad(amountSubFee(parseWad(target), feePerbicent)),
  //   // )
  //   // return parseFloat(((percent * targetSubFee) / 100).toFixed(4))
  // }

  const onAmountChange = (newAmount: number) => {
    let newPercent = parseFloat(
      getDistributionPercentFromAmount({
        amount: newAmount,
        distributionLimit,
      }),
    )
    form.setFieldsValue({ amount: newAmount })
    form.setFieldsValue({ percent: newPercent })
  }

  // Validates new payout receiving address
  const validatePayoutAddress = () => {
    return validateEthAddress(
      form.getFieldValue('beneficiary'),
      splits,
      mode,
      splitIndex,
    )
  }

  const validatePayoutPercentage = () => {
    return validatePercentage(form.getFieldValue('percent'))
  }

  // export const isPercentBeingRounded = () => {
  //   return countDecimalPlaces(form.getFieldValue('percent')) > 2
  // }

  return (
    <Modal
      title={mode === 'Edit' ? t`Edit existing split` : t`Add a payout`}
      visible={visible}
      onOk={setSplit}
      okText={mode === 'Edit' ? t`Save split` : t`Add payout`}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onKeyDown={e => {
          if (e.key === 'Enter') setSplit()
        }}
      >
        <Form.Item>
          <Select value={editingSplitType} onChange={setEditingSplitType}>
            <Select.Option value="address">
              <Trans>Wallet address</Trans>
            </Select.Option>
            <Select.Option value="project">
              <Trans>Juicebox project</Trans>
            </Select.Option>
          </Select>
        </Form.Item>

        {editingSplitType === 'address' ? (
          <FormItems.EthAddress
            name="beneficiary"
            defaultValue={form.getFieldValue('beneficiary')}
            formItemProps={{
              label: t`Address`,
              rules: [
                {
                  validator: validatePayoutPercentage,
                },
              ],
            }}
            onAddressChange={(beneficiary: string) =>
              form.setFieldsValue({ beneficiary })
            }
          />
        ) : (
          <FormItems.ProjectHandleFormItem
            name="projectId"
            requireState="exists"
            initialValue={form.getFieldValue('projectId')}
            formItemProps={{
              label: t`Project id`,
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
                      return Promise.reject(t`Address is required`)
                    else if (address === constants.AddressZero)
                      return Promise.reject(t`Cannot use zero address.`)
                    else return Promise.resolve()
                  },
                },
              ],
            }}
            onAddressChange={beneficiary =>
              form.setFieldsValue({ beneficiary })
            }
          />
        ) : null}

        {/* Only show amount input if project distribution limit is not infinite */}
        {!parseWad(distributionLimit).eq(constants.MaxUint256) ? (
          <Form.Item
            label={t`Amount`}
            // Display message to user if the amount they inputted
            // will result in percentage with > 2 decimal places
            // and no error is present
            className="ant-form-item-extra-only"
            extra={
              'poo'
              // isPercentBeingRounded() &&
              // !(form.getFieldValue('percent') > 100) ? (
              //   <div>
              //     <Trans>Will be rounded to{' '}
              //       <CurrencySymbol currency={currencyName} />
              //       {roundedDownAmount()}
              //     </Trans>
              //   </div>
              // ) : null
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
                  rules: [{ validator: validatePayoutAddress }],
                }}
                accessory={<InputAccessoryButton content={currencyName} />}
              />
            </div>
          </Form.Item>
        ) : null}

        {/* <Form.Item label={t`Percent`}>
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
        </Form.Item> */}
        <Form.Item
          name="lockedUntil"
          label="Lock until"
          extra="If locked, this can't be edited or removed until the lock expires or the funding cycle is reconfigured."
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  )
}
