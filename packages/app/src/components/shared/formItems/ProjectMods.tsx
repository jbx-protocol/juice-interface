import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Select, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ThemeContext } from 'contexts/themeContext'
import { BigNumber, constants, utils } from 'ethers'
import useContractReader from 'hooks/ContractReader'
import { ContractName } from 'models/contract-name'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/mods'
import { useCallback, useContext, useState } from 'react'
import { formattedNum, fromPerbicent, parsePerbicent } from 'utils/formatNumber'

import { FormItems } from '.'
import CurrencySymbol from '../CurrencySymbol'
import NumberSlider from '../inputs/NumberSlider'
import ProjectHandle from '../ProjectHandle'
import { FormItemExt } from './formItemExt'

type ModType = 'project' | 'address'

export default function ProjectMods({
  name,
  target,
  currency,
  hideLabel,
  mods,
  onModsChanged,
  formItemProps,
}: {
  target: number
  mods: ModRef[]
  onModsChanged: (mods: ModRef[]) => void
  currency: CurrencyOption
} & FormItemExt) {
  const [form] = useForm<{
    handle: string
    beneficiary: string
    percent: number
  }>()
  const [editingModIndex, setEditingModIndex] = useState<number>()
  const [settingHandleIndex, setSettingHandleIndex] = useState<number>()
  const [editingModType, setEditingModType] = useState<ModType>('address')
  const [projectHandle, setProjectHandle] = useState<string>()

  useContractReader<BigNumber>({
    contract: ContractName.Projects,
    functionName: 'projectFor',
    args: projectHandle ? [utils.formatBytes32String(projectHandle)] : null,
    callback: useCallback(
      (id?: BigNumber) => {
        onModsChanged(
          mods.map((m, i) =>
            i === settingHandleIndex
              ? {
                  ...m,
                  projectId: id?.toHexString(),
                }
              : m,
          ),
        )
        setProjectHandle(undefined)
        setSettingHandleIndex(undefined)
      },
      [form, onModsChanged, mods],
    ),
  })

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const gutter = 10

  const total = mods.reduce(
    (acc, curr) => acc + parseFloat(fromPerbicent(curr.percent ?? '0')),
    0,
  )

  const modInput = useCallback(
    (mod: ModRef, index: number) => (
      <div
        style={{
          color: colors.text.primary,
          cursor: 'default',
        }}
        key={mod.beneficiary ?? '' + index}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          {mod.projectId ? (
            <Row gutter={gutter} style={{ width: '100%' }} align="middle">
              <Col span={4}>
                <label>Project</label>{' '}
              </Col>
              <Col span={20}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setEditingModType('project')
                      form.setFieldsValue({
                        ...mod,
                        percent: parseFloat(fromPerbicent(mod.percent)),
                      })
                      setEditingModIndex(index)
                    }}
                  >
                    @<ProjectHandle projectId={mod.projectId} />
                  </span>
                  <Button
                    type="text"
                    onClick={e => {
                      onModsChanged([
                        ...mods.slice(0, index),
                        ...mods.slice(index + 1),
                      ])
                    }}
                    icon={<CloseCircleOutlined />}
                  />
                </div>
              </Col>
            </Row>
          ) : (
            <Row gutter={gutter} style={{ width: '100%' }} align="middle">
              <Col span={4}>
                <label>Address</label>{' '}
              </Col>
              <Col span={20}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setEditingModType('address')
                      form.setFieldsValue({
                        ...mod,
                        percent: parseFloat(fromPerbicent(mod.percent)),
                      })
                      setEditingModIndex(index)
                    }}
                  >
                    {mod.beneficiary}
                  </span>
                  <Button
                    type="text"
                    onClick={e => {
                      onModsChanged([
                        ...mods.slice(0, index),
                        ...mods.slice(index + 1),
                      ])
                    }}
                    icon={<CloseCircleOutlined />}
                  />
                </div>
              </Col>
            </Row>
          )}

          {mod.projectId ? (
            <Row>
              <Col span={4}>
                <label>Beneficiary</label>
              </Col>
              <Col span={20}>
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setEditingModType('project')
                    form.setFieldsValue({
                      ...mod,
                      percent: parseFloat(fromPerbicent(mod.percent)),
                    })
                    setEditingModIndex(index)
                  }}
                >
                  {mod.beneficiary}
                </span>
              </Col>
            </Row>
          ) : null}

          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={4}>
              <label>Amount</label>
            </Col>
            <Col span={20}>
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
                  <CurrencySymbol currency={currency} />
                  {formattedNum(
                    (target * parseFloat(fromPerbicent(mod.percent))) / 100,
                  )}
                </span>

                <div style={{ flex: 1 }}>
                  <NumberSlider
                    value={parseFloat(fromPerbicent(mod.percent))}
                    suffix="%"
                    step={0.5}
                    onChange={v =>
                      onModsChanged(
                        mods.map((m, i) =>
                          i === index
                            ? {
                                ...m,
                                percent: parsePerbicent(
                                  v?.toString(),
                                ).toNumber(),
                              }
                            : m,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Space>
      </div>
    ),
    [mods, currency, target],
  )

  const setReceiver = async () => {
    await form.validateFields()

    const handle = form.getFieldValue('handle')
    const beneficiary = form.getFieldValue('beneficiary')
    const percent = parsePerbicent(form.getFieldValue('percent')).toNumber()

    onModsChanged(
      editingModIndex !== undefined && editingModIndex < mods.length
        ? mods.map((m, i) =>
            i === editingModIndex ? { ...m, beneficiary, percent } : m,
          )
        : [
            ...mods,
            {
              beneficiary,
              percent,
            },
          ],
    )

    if (handle) {
      setProjectHandle(handle)
      setSettingHandleIndex(editingModIndex)
    }

    setEditingModIndex(undefined)

    form.resetFields()
  }

  return (
    <Form.Item
      extra="Commit portions of your project's funding to other Ethereum wallets or Juice projects. Use this to pay contributors, charities, other projects you depend on, or anyone else. Payouts will be distributed automatically anytime a withdrawal is made from your project."
      label={hideLabel ? undefined : 'Auto payouts (optional)'}
      name={name}
      {...formItemProps}
      dependencies={['currency']}
      rules={[
        {
          validator: (rule: any, value: any) => {
            if (total > 100)
              return Promise.reject('Percentages must add up to less than 100%')

            return Promise.resolve()
          },
        },
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Space
          style={{ width: '100%' }}
          direction="vertical"
          size="small"
          split={
            <div
              style={{ height: 1, background: colors.stroke.tertiary }}
            ></div>
          }
        >
          {mods.map((v, i) => modInput(v, i))}
        </Space>
        {mods.length && total > 100 ? (
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: colors.text.warn }}>
              Total:{' '}
              {total
                .toString()
                .split('.')
                .map((x, i) => (i > 0 ? x[0] : x))
                .join('.')}
            </span>
            <span style={{ color: colors.text.secondary }}>/100%</span>
          </div>
        ) : null}
        <Button
          type="dashed"
          onClick={() => {
            setEditingModIndex(mods.length)
            form.resetFields()
          }}
          block
        >
          Add a payout
        </Button>
      </Space>

      <Modal
        title="Add payout"
        visible={editingModIndex !== undefined}
        onOk={setReceiver}
        onCancel={() => {
          form.resetFields()
          setEditingModIndex(undefined)
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
              <Select.Option value="project">Juice project</Select.Option>
            </Select>
          </Form.Item>

          {editingModType === 'address' ? (
            <Form.Item
              name="beneficiary"
              label="Address"
              rules={[
                {
                  validator: (rule, value) => {
                    if (!utils.isAddress(value))
                      return Promise.reject('Not a valid ETH address.')

                    return Promise.resolve()
                  },
                },
              ]}
            >
              <Input placeholder={constants.AddressZero} />
            </Form.Item>
          ) : (
            <FormItems.ProjectHandle
              name="project"
              requireState="exists"
              formItemProps={{ label: 'Project handle' }}
              onValueChange={handle => form.setFieldsValue({ handle })}
            ></FormItems.ProjectHandle>
          )}
          {editingModType === 'project' ? (
            <Form.Item
              name="beneficiary"
              label="Beneficiary"
              extra="The address that should receive the tickets printed from paying this project."
            >
              <Input placeholder={constants.AddressZero} />
            </Form.Item>
          ) : null}
          <Form.Item name="percent" label="Percent">
            <NumberSlider
              onChange={percent => form.setFieldsValue({ percent })}
              step={0.5}
              defaultValue={form.getFieldValue('percent') || 0}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Form.Item>
  )
}
