import { CloseCircleOutlined, LockOutlined } from '@ant-design/icons'
import { Button, Col, DatePicker, Form, Modal, Row, Select, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants, utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { PayoutMod } from 'models/mods'
import * as moment from 'moment'
import { useCallback, useContext, useState } from 'react'
import { formatDate } from 'utils/formatDate'
import {
  formatWad,
  fromPermyriad,
  parsePermyriad,
  parseWad,
} from 'utils/formatNumber'
import { amountSubFee } from 'utils/math'

import { FormItems } from '.'
import CurrencySymbol from '../CurrencySymbol'
import FormattedAddress from '../FormattedAddress'
import NumberSlider from '../inputs/NumberSlider'
import ProjectHandle from '../ProjectHandle'
import { FormItemExt } from './formItemExt'

type ModType = 'project' | 'address'

type EditingPayoutMod = PayoutMod & { handle?: string }

export default function ProjectPayoutMods({
  name,
  target,
  currency,
  fee,
  lockedMods,
  mods,
  onModsChanged,
  formItemProps,
}: {
  target: string
  currency: CurrencyOption
  fee: BigNumber | undefined
  lockedMods?: EditingPayoutMod[]
  mods: EditingPayoutMod[] | undefined
  onModsChanged: (mods: EditingPayoutMod[]) => void
} & FormItemExt) {
  const [form] = useForm<{
    handle: string
    beneficiary: string
    percent: number
    lockedUntil: moment.Moment
  }>()
  const [editingModProjectId, setEditingModProjectId] = useState<BigNumber>()
  const [editingModIndex, setEditingModIndex] = useState<number>()
  const [editingPercent, setEditingPercent] = useState<number>()
  const [settingHandleIndex, setSettingHandleIndex] = useState<number>()
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [settingHandle, setSettingHandle] = useState<string>()

  const { owner } = useContext(ProjectContext)

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
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
      [form, onModsChanged, mods],
    ),
  })

  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

  const gutter = 10

  const modInput = useCallback(
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
              form.setFieldsValue({
                ...mod,
                percent,
                lockedUntil: mod.lockedUntil
                  ? moment.default(mod.lockedUntil * 1000)
                  : undefined,
              })
              setEditingModIndex(index)
              setEditingPercent(percent)
              setEditingModProjectId(mod.projectId)
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
                            { decimals: 4, padEnd: true },
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
    [mods, colors, radii],
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

    form.resetFields()
  }

  return (
    <Form.Item
      name={name}
      {...formItemProps}
      rules={[
        {
          validator: () => {
            if (total > 100)
              return Promise.reject('Percentages must add up to less than 100%')

            return Promise.resolve()
          },
        },
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {lockedMods ? (
          <Space style={{ width: '100%' }} direction="vertical" size="small">
            {lockedMods.map((v, i) => modInput(v, i, true))}
          </Space>
        ) : null}
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          {mods.map((v, i) => modInput(v, i))}
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
            Total: {total.toFixed(2)}%
          </div>
          <div>
            {(100 - total).toFixed(2)}% to <FormattedAddress address={owner} />
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setEditingModIndex(mods.length)
            setEditingPercent(0)
            setEditingModProjectId(undefined)
            form.resetFields()
          }}
          block
        >
          Add a payout
        </Button>
      </Space>

      <Modal
        title="Add a payout"
        visible={editingModIndex !== undefined}
        onOk={setReceiver}
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
          ) : (
            <FormItems.ProjectHandle
              name="project"
              requireState="exists"
              formItemProps={{
                label: 'Project handle',
                rules: [{ required: true }],
              }}
              value={editingModProjectId}
              onValueChange={handle => form.setFieldsValue({ handle })}
            />
          )}
          {editingModType === 'project' ? (
            <FormItems.EthAddress
              name="beneficiary"
              defaultValue={form.getFieldValue('beneficiary')}
              formItemProps={{
                label: 'Address',
                extra:
                  'The address that should receive the tokens minted from paying this project.',
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
          <Form.Item label="Percent" rules={[{ required: true }]}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ flex: 1, marginRight: 10 }}>
                <NumberSlider
                  onChange={percent => {
                    form.setFieldsValue({ percent })
                    setEditingPercent(percent)
                  }}
                  step={0.01}
                  defaultValue={form.getFieldValue('percent') || 0}
                  suffix="%"
                />
              </span>

              {parseWad(target).lt(constants.MaxUint256) && (
                <span style={{ color: colors.text.primary }}>
                  <CurrencySymbol currency={currency} />
                  {formatWad(
                    amountSubFee(parseWad(target), fee)
                      ?.mul(Math.floor((editingPercent ?? 0) * 100))
                      .div(10000),
                    { decimals: 4, padEnd: true },
                  )}
                </span>
              )}
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
