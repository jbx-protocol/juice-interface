import { CloseCircleOutlined, LockOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, DatePicker, Form, Modal, Row, Select, Space } from 'antd'
import {
  validateEthAddress,
  validatePercentage,
  getAmountFromPercent,
  getPercentFromAmount,
  countDecimalPlaces,
  roundDown,
  ModalMode,
} from 'components/shared/formItems/formHelpers'
import { useForm } from 'antd/lib/form/Form'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants, utils } from 'ethers'
import useContractReader from 'hooks/v1/contractReader/ContractReader'
import { V1ContractName } from 'models/v1/contracts'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod } from 'models/mods'
import * as moment from 'moment'
import { useCallback, useContext, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import {
  formatWad,
  fromPermyriad,
  parsePermyriad,
  parseWad,
  fromWad,
} from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'
import { currencyName } from 'utils/v1/currency'

import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { FormItems } from '.'
import CurrencySymbol from '../CurrencySymbol'
import FormattedAddress from '../FormattedAddress'
import NumberSlider from '../inputs/NumberSlider'
import ProjectHandle from '../ProjectHandle'
import { FormItemExt } from './formItemExt'

type ModType = 'project' | 'address'

type EditingPayoutMod = PayoutMod & { handle?: string }

export default function ProjectPayoutMods({
  target,
  currency,
  fee,
  lockedMods,
  mods,
  onModsChanged,
  formItemProps,
}: {
  target: string
  currency: V1CurrencyOption
  fee: BigNumber | undefined
  lockedMods?: EditingPayoutMod[]
  mods: EditingPayoutMod[] | undefined
  onModsChanged: (mods: EditingPayoutMod[]) => void
} & FormItemExt) {
  const [form] = useForm<{
    handle: string
    beneficiary: string
    percent: number
    amount: number
    lockedUntil: moment.Moment
  }>()
  const [modalMode, setModalMode] = useState<ModalMode>() //either 'Add', 'Edit' or undefined
  const [editingModProjectId, setEditingModProjectId] = useState<BigNumber>()
  const [editingModIndex, setEditingModIndex] = useState<number>()
  const [editingPercent, setEditingPercent] = useState<number>()
  const [settingHandleIndex, setSettingHandleIndex] = useState<number>()
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [settingHandle, setSettingHandle] = useState<string>()

  const { owner } = useContext(V1ProjectContext)

  useContractReader<BigNumber>({
    contract: V1ContractName.Projects,
    functionName: 'projectFor',
    args: settingHandle ? [utils.formatBytes32String(settingHandle)] : null,
    callback: useCallback(
      (projectId?: BigNumber) => {
        if (!mods) return
        onModsChanged(
          mods.map((m, i) =>
            i === settingHandleIndex
              ? {
                  ...m,
                  projectId,
                }
              : m,
          ),
        )
        setSettingHandle(undefined)
        setSettingHandleIndex(undefined)
      },
      [mods, onModsChanged, settingHandleIndex],
    ),
  })

  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const gutter = 10

  const ModInput = useCallback(
    (mod: EditingPayoutMod, index: number, locked?: boolean) => {
      if (!mods) return

      return (
        <div
          style={{
            display: 'flex',
            padding: 10,
            border:
              '1px solid ' +
              (locked ? colors.stroke.disabled : colors.stroke.tertiary),
            borderRadius: radii.md,
          }}
          key={mod.beneficiary ?? '' + index}
        >
          <Space
            direction="vertical"
            style={{
              width: '100%',
              color: colors.text.primary,
              cursor: locked ? 'default' : 'pointer',
            }}
            onClick={() => {
              if (locked) return

              const percent = parseFloat(fromPermyriad(mod.percent))

              setEditingModType(
                BigNumber.from(mod.projectId || '0').gt(0)
                  ? 'project'
                  : 'address',
              )
              setModalMode('Edit')
              setEditingModIndex(index)
              setEditingPercent(percent)
              setEditingModProjectId(mod.projectId)

              form.setFieldsValue({
                ...mod,
                percent,
                amount: getAmountFromPercent(
                  editingPercent ?? percent,
                  target,
                  fee,
                ),
                lockedUntil: mod.lockedUntil
                  ? moment.default(mod.lockedUntil * 1000)
                  : undefined,
              })
            }}
          >
            {mod.projectId?.gt(0) ? (
              <Row gutter={gutter} style={{ width: '100%' }} align="middle">
                <Col span={5}>
                  <label>Project:</label>{' '}
                </Col>
                <Col span={19}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      <ProjectHandle link projectId={mod.projectId} />
                    </span>
                  </div>
                </Col>
              </Row>
            ) : (
              <Row gutter={gutter} style={{ width: '100%' }} align="middle">
                <Col span={5}>
                  <label>Address:</label>{' '}
                </Col>
                <Col span={19}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ cursor: 'pointer' }}>
                      <FormattedAddress address={mod.beneficiary} />
                    </span>
                  </div>
                </Col>
              </Row>
            )}

            {mod.projectId?.gt(0) ? (
              <Row>
                <Col span={5}>
                  <label>Beneficiary:</label>
                </Col>
                <Col span={19}>
                  <span style={{ cursor: 'pointer' }}>
                    <FormattedAddress address={mod.beneficiary} />
                  </span>
                </Col>
              </Row>
            ) : null}

            <Row gutter={gutter} style={{ width: '100%' }} align="middle">
              <Col span={5}>
                <label>Percentage:</label>
              </Col>
              <Col span={19}>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span
                    style={{
                      marginRight: 10,
                      width: 100,
                      maxWidth: 100,
                    }}
                  >
                    <Space size="large">
                      <span>{fromPermyriad(mod.percent)}%</span>
                      {parseWad(target).lt(constants.MaxUint256) && (
                        <span>
                          <CurrencySymbol currency={currency} />
                          {formatWad(
                            amountSubFee(parseWad(target), fee)
                              ?.mul(mod.percent)
                              .div(10000),
                            { precision: 4, padEnd: true },
                          )}
                        </span>
                      )}
                    </Space>
                  </span>
                </div>
              </Col>
            </Row>

            {mod.lockedUntil ? (
              <Row gutter={gutter} style={{ width: '100%' }} align="middle">
                <Col span={5}>
                  <label>Locked</label>
                </Col>
                <Col span={19}>
                  until {formatDate(mod.lockedUntil * 1000, 'MM-DD-yyyy')}
                </Col>
              </Row>
            ) : null}
          </Space>

          {locked ? (
            <LockOutlined style={{ color: colors.icon.disabled }} />
          ) : (
            <Button
              type="text"
              onClick={e => {
                onModsChanged([
                  ...mods.slice(0, index),
                  ...mods.slice(index + 1),
                ])
                e.stopPropagation()
              }}
              icon={<CloseCircleOutlined />}
            />
          )}
        </div>
      )
    },
    [
      mods,
      colors.stroke.disabled,
      colors.stroke.tertiary,
      colors.text.primary,
      colors.icon.disabled,
      radii.md,
      target,
      currency,
      fee,
      form,
      editingPercent,
      onModsChanged,
    ],
  )

  if (!mods) return null

  const total = mods.reduce(
    (acc, curr) => acc + parseFloat(fromPermyriad(curr.percent ?? '0')),
    0,
  )

  const setReceiver = async () => {
    await form.validateFields()

    const handle = form.getFieldValue('handle')
    const beneficiary = form.getFieldValue('beneficiary')
    const percent = parsePermyriad(form.getFieldValue('percent')).toNumber()
    const _lockedUntil = form.getFieldValue('lockedUntil') as moment.Moment

    const lockedUntil = _lockedUntil
      ? Math.round(_lockedUntil.valueOf() / 1000)
      : undefined

    // Store handle in mod object only to repopulate handle input while editing
    const newMod = { beneficiary, percent, handle, lockedUntil }

    onModsChanged(
      editingModIndex !== undefined && editingModIndex < mods.length
        ? mods.map((m, i) =>
            i === editingModIndex
              ? {
                  ...m,
                  ...newMod,
                }
              : m,
          )
        : [...mods, newMod],
    )

    if (handle) {
      setSettingHandle(handle)
      setSettingHandleIndex(editingModIndex)
    }

    setEditingModIndex(undefined)
    setEditingPercent(0)
    form.resetFields()
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

  const roundedDownAmount = () => {
    const percent = roundDown(form.getFieldValue('percent'), 2)
    const targetSubFee = parseFloat(
      fromWad(amountSubFee(parseWad(target), fee)),
    )
    return parseFloat(((percent * targetSubFee) / 100).toFixed(4))
  }

  const onAmountChange = (newAmount: number | undefined) => {
    let newPercent = getPercentFromAmount(newAmount, target, fee)
    setEditingPercent(newPercent)
    form.setFieldsValue({ amount: newAmount })
    form.setFieldsValue({ percent: newPercent })
  }
  return (
    <Form.Item
      {...formItemProps}
      style={{ ...formItemProps?.style, display: 'block' }}
    >
      <Space
        direction="vertical"
        style={{ width: '100%', minHeight: 0 }}
        size="large"
      >
        {lockedMods ? (
          <Space style={{ width: '100%' }} direction="vertical" size="small">
            {lockedMods.map((v, i) => ModInput(v, i, true))}
          </Space>
        ) : null}
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          {mods.map((v, i) => ModInput(v, i))}
        </Space>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            color: colors.text.secondary,
          }}
        >
          <div
            style={{
              color: total > 100 ? colors.text.warn : colors.text.secondary,
            }}
          >
            <Trans>Total: {total.toFixed(2)}%</Trans>
          </div>
          <div>
            {owner ? (
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                <FormattedAddress address={owner} />
              </Trans>
            ) : null}
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setModalMode('Add')
            setEditingModIndex(mods.length)
            setEditingPercent(0)
            setEditingModProjectId(undefined)
            form.resetFields()
          }}
          block
        >
          <Trans>Add a payout</Trans>
        </Button>
      </Space>

      <Modal
        title={modalMode === 'Edit' ? 'Edit existing payout' : 'Add a payout'}
        visible={editingModIndex !== undefined}
        onOk={setReceiver}
        okText={modalMode === 'Edit' ? 'Save payout' : 'Add payout'}
        onCancel={() => {
          form.resetFields()
          setEditingModIndex(undefined)
          setEditingModProjectId(undefined)
        }}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onKeyDown={e => {
            if (e.key === 'Enter') setReceiver()
          }}
        >
          <Form.Item>
            <Select value={editingModType} onChange={setEditingModType}>
              <Select.Option value="address">Wallet address</Select.Option>
              <Select.Option value="project">Juicebox project</Select.Option>
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
              initialValue={editingModProjectId}
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
                    validator: (rule: any, value: any) => {
                      const address = form.getFieldValue('beneficiary')
                      if (!address || !utils.isAddress(address))
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
          {parseWad(target).lt(constants.MaxUint256) ? ( // Target = MaxUint256 when unset
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
                    Will be rounded to <CurrencySymbol currency={currency} />
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
                  accessory={
                    <InputAccessoryButton content={currencyName(currency)} />
                  }
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
                      fee,
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
          </Form.Item>
        </Form>
      </Modal>
    </Form.Item>
  )
}
