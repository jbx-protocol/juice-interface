import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, Modal, Select } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import { FormItems } from 'components/formItems'
import {
  countDecimalPlaces,
  ModalMode,
  roundDown,
  validateEthAddress,
  validatePercentage,
} from 'components/formItems/formHelpers'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import NumberSlider from 'components/inputs/NumberSlider'

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
} from 'utils/format/formatNumber'
import { amountSubFee } from 'utils/v1/math'
import { getAmountFromPercent, getPercentFromAmount } from 'utils/v1/payouts'

import * as constants from '@ethersproject/constants'
import * as moment from 'moment'

import { BigNumber } from '@ethersproject/bignumber'

import { useForm } from 'antd/lib/form/Form'

import { CurrencyName } from 'constants/currency'

import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { EditingPayoutMod } from './types'

type ModType = 'project' | 'address'

type ProjectPayoutModsForm = {
  projectId: string
  handle: string
  beneficiary: string
  percent: number
  amount: number
  lockedUntil: moment.Moment
}

export const ProjectPayoutModsModal = ({
  visible,
  mods,
  editingModIndex,
  target,
  feePercentage,
  targetIsInfinite,
  currencyName,
  onOk,
  onCancel,
}: {
  visible: boolean
  mods: PayoutMod[]
  target: string
  editingModIndex: number | undefined
  feePercentage: string | undefined
  targetIsInfinite?: boolean
  currencyName: CurrencyName | undefined
  onOk: (mods: EditingPayoutMod[]) => void
  onCancel: VoidFunction
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [modalMode, setModalMode] = useState<ModalMode>('Add') //either 'Add', or 'Edit'
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [editingModHandle, setEditingModHandle] = useState<string | BigNumber>()
  const [, setEditingPercent] = useState<number>()
  const [form] = useForm<ProjectPayoutModsForm>()

  useEffect(() => {
    const loadSelectedMod = (mod: EditingPayoutMod) => {
      setModalMode('Edit')
      setEditingModType(
        BigNumber.from(mod.projectId ?? '0').gt(0) ? 'project' : 'address',
      )
      setEditingModHandle(mod.handle ?? mod.projectId)
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
    const beneficiary = form.getFieldValue('beneficiary')
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
    const newMod = { beneficiary, percent, handle, lockedUntil, projectId }

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

  return (
    <Modal
      title={modalMode === 'Edit' ? t`Edit payout` : t`Add new payout`}
      visible={visible}
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
                form.setFieldsValue({ handle: undefined, projectId: undefined })
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
          <FormItems.ProjectHandleFormItem
            name="handle"
            requireState="exists"
            initialValue={editingModHandle}
            returnValue="id"
            onValueChange={id => form.setFieldsValue({ projectId: id })}
            formItemProps={{
              label: t`Project handle`,
            }}
            required
          />
        )}
        {editingModType === 'project' ? (
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
                  else if (address === constants.AddressZero)
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
