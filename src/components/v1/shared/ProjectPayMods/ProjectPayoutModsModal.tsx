import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, Modal, Select } from 'antd'
import { useForm, useWatch } from 'antd/lib/form/Form'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { FormItems } from 'components/formItems'
import {
  countDecimalPlaces,
  ModalMode,
  roundDown,
  validateEthAddress,
  validatePercentage,
} from 'components/formItems/formHelpers'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import NumberSlider from 'components/inputs/NumberSlider'
import { LOCKED_PAYOUT_EXPLANATION } from 'components/strings'
import { NULL_ALLOCATOR_ADDRESS } from 'constants/contracts/mainnet/Allocators'
import { CurrencyName } from 'constants/currency'
import { constants } from 'ethers'

import { BigNumber } from 'ethers'
import { isAddress } from 'ethers/lib/utils'
import { PayoutMod } from 'models/v1/mods'
import * as moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { isZeroAddress } from 'utils/address'
import {
  fromWad,
  parseWad,
  percentToPerbicent,
  percentToPermyriad,
  permyriadToPercent,
} from 'utils/format/formatNumber'
import { amountSubFee } from 'utils/v1/math'
import { getAmountFromPercent, getPercentFromAmount } from 'utils/v1/payouts'
import { EditingPayoutMod } from './types'

type ModType = 'project' | 'address'

type ProjectPayoutModsForm = {
  projectId: string
  handle: string
  beneficiary: string
  allocator: string
  percent: number
  amount: number
  lockedUntil: moment.Moment
}

export const ProjectPayoutModsModal = ({
  open,
  mods,
  editingModIndex,
  target,
  feePercentage,
  targetIsInfinite,
  currencyName,
  onOk,
  onCancel,
}: {
  open: boolean
  mods: PayoutMod[]
  target: string
  editingModIndex: number | undefined
  feePercentage: string | undefined
  targetIsInfinite?: boolean
  currencyName: CurrencyName | undefined
  onOk: (mods: EditingPayoutMod[]) => void
  onCancel: VoidFunction
}) => {
  const [modalMode, setModalMode] = useState<ModalMode>('Add') //either 'Add', or 'Edit'
  // states are all initial values only
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [editingModHandle, setEditingModHandle] = useState<string | BigNumber>()
  const [editingModAllocator, setEditingModAllocator] = useState<string>()
  const [, setEditingPercent] = useState<number>()
  const [form] = useForm<ProjectPayoutModsForm>()

  useEffect(() => {
    const loadSelectedMod = (mod: EditingPayoutMod) => {
      setModalMode('Edit')
      setEditingModType(
        BigNumber.from(mod.projectId ?? '0').gt(0) ? 'project' : 'address',
      )
      setEditingModHandle(mod.handle ?? mod.projectId)
      setEditingModAllocator(mod.allocator)
      const percent = parseFloat(permyriadToPercent(mod.percent))
      setEditingPercent(percent)
      form.setFieldsValue({
        ...mod,
        handle: mod.handle,
        beneficiary: mod.beneficiary,
        percent,
        projectId: mod.projectId?.toString(),
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
      setEditingModAllocator(undefined)
      setEditingPercent(undefined)
    }

    if (editingModIndex === undefined) {
      resetModal()
      return
    }

    const mod = mods[editingModIndex]
    loadSelectedMod(mod)
  }, [editingModIndex, feePercentage, form, mods, target])

  const feePerbicent = percentToPerbicent(feePercentage)

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
    const newPercent = getPercentFromAmount(newAmount, target, feePercentage)
    setEditingPercent(newPercent)
    form.setFieldsValue({ amount: newAmount })
    form.setFieldsValue({ percent: newPercent })
  }

  const validateAndSave = async () => {
    await form.validateFields()

    const handle = form.getFieldValue('handle')
    const allocator = form.getFieldValue('allocator')

    // alloctor uses `addToBalance`, therefore no beneficiary required
    const beneficiary =
      !allocator || allocator === NULL_ALLOCATOR_ADDRESS
        ? form.getFieldValue('beneficiary')
        : constants.AddressZero

    const percent = percentToPermyriad(form.getFieldValue('percent')).toNumber()
    const _projectId = form.getFieldValue('projectId')
    const projectId = _projectId ? BigNumber.from(_projectId) : undefined
    const _lockedUntil = form.getFieldValue('lockedUntil') as
      | moment.Moment
      | undefined

    const lockedUntil = _lockedUntil
      ? Math.round(_lockedUntil.valueOf() / 1000)
      : undefined

    // Store handle in mod object only to repopulate handle input while editing
    const newMod = {
      beneficiary,
      percent,
      allocator,
      handle,
      lockedUntil,
      projectId,
    }

    let modsToReturn = [...mods, newMod]
    if (editingModIndex !== undefined && editingModIndex < mods.length) {
      modsToReturn = mods.map((m, i) =>
        i === editingModIndex ? { ...m, ...newMod } : m,
      )
    }
    onOk(modsToReturn)

    return true
  }

  const discardAndClose = () => {
    onCancel()
    return true
  }

  const allocator = useWatch('allocator', form)

  return (
    <Modal
      title={modalMode === 'Edit' ? t`Edit payout` : t`Add new payout`}
      open={open}
      onOk={validateAndSave}
      okText={modalMode === 'Edit' ? t`Save payout` : t`Add payout`}
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
          <Select
            value={editingModType}
            onChange={type => {
              setEditingModType(type)
              if (type === 'address')
                form.setFieldsValue({
                  handle: undefined,
                  projectId: undefined,
                  allocator: NULL_ALLOCATOR_ADDRESS,
                })
            }}
          >
            <Select.Option value="address">
              <Trans>Wallet address</Trans>
            </Select.Option>
            <Select.Option value="project">
              <Trans>Juicebox project</Trans>
            </Select.Option>
          </Select>
        </Form.Item>

        {editingModType === 'address' ? (
          <Form.Item
            name="beneficiary"
            label="Address"
            rules={[
              {
                validator: validatePayoutAddress,
                validateTrigger: 'onCreate',
                required: true,
              },
            ]}
          >
            <EthAddressInput />
          </Form.Item>
        ) : (
          <FormItems.ProjectPayoutFormItem
            initialHandle={editingModHandle}
            initialAllocator={editingModAllocator}
            onChange={id => form.setFieldsValue({ projectId: id })}
          />
        )}
        {editingModType === 'project' &&
        allocator === NULL_ALLOCATOR_ADDRESS ? (
          <Form.Item
            name="beneficiary"
            label={t`Address`}
            extra={t`The address that should receive the tokens minted from paying this project.`}
            rules={[
              {
                validator: (_, value) => {
                  const address = value
                  if (!address || !isAddress(address))
                    return Promise.reject('Address is required')
                  else if (isZeroAddress(address))
                    return Promise.reject('Cannot use zero address.')
                  else return Promise.resolve()
                },
              },
            ]}
          >
            <EthAddressInput />
          </Form.Item>
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
            rules={[{ validator: validatePayout }]}
          >
            <div className="flex items-center text-black dark:text-slate-100">
              <FormattedNumberInput
                value={form.getFieldValue('amount')}
                placeholder={'0'}
                onChange={amount => onAmountChange(parseFloat(amount || '0'))}
                accessory={<InputAccessoryButton content={currencyName} />}
              />
            </div>
          </Form.Item>
        ) : null}

        <Form.Item label={t`Percent`}>
          <div className="flex items-center">
            <span className="flex-1">
              <NumberSlider
                onChange={(percent: number | undefined) => {
                  const newAmount = getAmountFromPercent(
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
          extra={LOCKED_PAYOUT_EXPLANATION}
        >
          <DatePicker />
        </Form.Item>
      </Form>
    </Modal>
  )
}
