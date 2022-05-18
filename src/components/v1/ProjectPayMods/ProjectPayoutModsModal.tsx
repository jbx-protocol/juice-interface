import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, Modal, Select } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { FormItems } from 'components/shared/formItems'
import {
  countDecimalPlaces,
  ModalMode,
  roundDown,
  validateEthAddress,
  validatePercentage,
} from 'components/shared/formItems/formHelpers'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import NumberSlider from 'components/shared/inputs/NumberSlider'

import { ThemeContext } from 'contexts/themeContext'
import { isAddress } from 'ethers/lib/utils'
import { PayoutMod } from 'models/mods'
import { useCallback, useContext, useEffect, useState } from 'react'
import {
  fromWad,
  parseWad,
  percentToPerbicent,
  percentToPermyriad,
  permyriadToPercent,
} from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'
import { getAmountFromPercent, getPercentFromAmount } from 'utils/v1/payouts'

import * as constants from '@ethersproject/constants'
import * as moment from 'moment'

import { BigNumber } from '@ethersproject/bignumber'

import { useForm } from 'antd/lib/form/Form'

import { CurrencyName } from 'constants/currency'

type ModType = 'project' | 'address'
type EditingPayoutMod = PayoutMod & { handle?: string; percent?: number }

type ProjectPayoutModsForm = {
  handle: string
  beneficiary: string
  percent: number
  amount: number
  lockedUntil: moment.Moment
}

export const ProjectPayoutModsModal = ({
  visible,
  target,
  feePercentage,
  mods,
  editingModIndex,
  targetIsInfinite,
  currencyName,
  onOk,
  onCancel,
}: {
  target: string
  feePercentage: string | undefined
  mods: PayoutMod[]
  editingModIndex: number | undefined
  targetIsInfinite?: boolean
  currencyName: CurrencyName | undefined
  visible: boolean
  onOk: (mods: EditingPayoutMod[]) => void
  onCancel: VoidFunction
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [modalMode, setModalMode] = useState<ModalMode>('Add') //either 'Add', or 'Edit'
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [editingModHandle, setEditingModHandle] = useState<string>()
  // kind of a hack to get the form to work.
  const [, setEditingPercent] = useState<number>()
  // const form = Form.useFormInstance<ProjectPayoutModsForm>()
  const [form] = useForm<ProjectPayoutModsForm>()

  useEffect(() => {
    const loadSelectedMod = (mod: EditingPayoutMod) => {
      setModalMode('Edit')
      setEditingModType(
        BigNumber.from(mod.projectId ?? '0').gt(0) ? 'project' : 'address',
      )
      setEditingModType(mod.handle ? 'project' : 'address')
      setEditingModHandle(editingModHandle)
      const percent = parseFloat(permyriadToPercent(mod.percent))
      setEditingPercent(percent)
      form.setFieldsValue({ handle: 'this-is-handle' })
      form.setFieldsValue({
        ...mod,
        handle: mod.handle,
        beneficiary: mod.beneficiary,
        percent,
        amount: getAmountFromPercent(percent, target, feePercentage),
        lockedUntil: mod.lockedUntil
          ? moment.default(mod.lockedUntil * 1000)
          : undefined,
      })
    }

    const resetModal = () => {
      form.resetFields()
      setModalMode('Add')
      setEditingModType('address')
      setEditingModHandle(undefined)
      setEditingPercent(undefined)
    }

    if (editingModIndex === undefined) {
      resetModal()
      return
    }

    const mod = mods[editingModIndex]
    loadSelectedMod(mod)
  }, [editingModHandle, editingModIndex, feePercentage, form, mods, target])

  const feePerbicent = percentToPerbicent(feePercentage)

  const cleanupModal = () => {
    form.resetFields()
    setEditingPercent(0)
  }

  // Validates the amount and percentage (ensures percent !== 0 or > 100)
  const validatePayout = () => {
    return validatePercentage(form.getFieldValue('percent'))
  }

  // Validates new payout receiving address
  const validatePayoutAddress = () => {
    return validateEthAddress(
      form.getFieldValue('beneficiary'),
      mods,
      modalMode,
      editingModIndex,
    )
  }

  const isPercentBeingRounded = () => {
    return countDecimalPlaces(form.getFieldValue('percent')) > 2
  }

  const roundedDownAmount = useCallback(() => {
    const percent = roundDown(form.getFieldValue('percent'), 2)
    const targetSubFee = parseFloat(
      fromWad(amountSubFee(parseWad(target), feePerbicent)),
    )
    return parseFloat(((percent * targetSubFee) / 100).toFixed(4))
  }, [feePerbicent, form, target])

  const onAmountChange = (newAmount: number | undefined) => {
    let newPercent = getPercentFromAmount(newAmount, target, feePercentage)
    setEditingPercent(newPercent)
    form.setFieldsValue({ amount: newAmount })
    form.setFieldsValue({ percent: newPercent })
  }

  const validateAndSave = async () => {
    await form.validateFields()

    const handle = form.getFieldValue('handle')
    const beneficiary = form.getFieldValue('beneficiary')
    const percent = percentToPermyriad(form.getFieldValue('percent')).toNumber()
    const _lockedUntil = form.getFieldValue('lockedUntil') as
      | moment.Moment
      | undefined

    const lockedUntil = _lockedUntil
      ? Math.round(_lockedUntil.valueOf() / 1000)
      : undefined

    // Store handle in mod object only to repopulate handle input while editing
    const newMod = { beneficiary, percent, handle, lockedUntil }

    let modsToReturn = [...mods, newMod]
    if (editingModIndex !== undefined && editingModIndex < mods.length) {
      modsToReturn = mods.map((m, i) =>
        i === editingModIndex ? { ...m, ...newMod } : m,
      )
    }
    cleanupModal()
    onOk(modsToReturn)

    return true
  }

  const discardAndClose = () => {
    cleanupModal()
    onCancel()
    return true
  }

  return (
    <Modal
      title={modalMode === 'Edit' ? t`Edit existing split` : t`Add a payout`}
      visible={visible}
      onOk={validateAndSave}
      okText={modalMode === 'Edit' ? t`Save split` : t`Add payout`}
      onCancel={discardAndClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onKeyDown={e => {
          if (e.key === 'Enter') validateAndSave()
        }}
      >
        <Form.Item>
          <Select value={editingModType} onChange={setEditingModType}>
            <Select.Option value="address">
              <Trans>Wallet address</Trans>
            </Select.Option>
            <Select.Option value="project">
              <Trans>Juicebox project</Trans>
            </Select.Option>
          </Select>
        </Form.Item>

        {editingModType === 'address' ? (
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
            initialValue={editingModHandle}
            formItemProps={{
              label: t`Project handle`,
            }}
            required
          />
        )}
        {editingModType === 'project' ? (
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
        ) : null}

        {/* Only show amount input if project has a funding target */}
        {!targetIsInfinite ? (
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
                  <Trans>
                    Will be rounded to{' '}
                    <CurrencySymbol currency={currencyName} />
                    {roundedDownAmount()}
                  </Trans>
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

        <Form.Item label={t`Percent`}>
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
          label={t`Lock until`}
          extra={
            <Trans>
              If locked, this split can't be edited or removed until the lock
              expires or the funding cycle is reconfigured.
            </Trans>
          }
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  )
}
