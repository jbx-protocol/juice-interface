import { CloseCircleOutlined } from '@ant-design/icons'
import { Button, Col, Form, Input, Modal, Row, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ThemeContext } from 'contexts/themeContext'
import { constants, utils } from 'ethers'
import { CurrencyOption } from 'models/currency-option'
import { ModRef } from 'models/mods'
import { useCallback, useContext, useState } from 'react'
import { formattedNum, fromPerbicent, parsePerbicent } from 'utils/formatNumber'

import CurrencySymbol from '../CurrencySymbol'
import NumberSlider from '../inputs/NumberSlider'
import { FormItemExt } from './formItemExt'

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
  const [form] = useForm<{ beneficiary: string; note: string }>()
  const [editingModIndex, setEditingModIndex] = useState<number>()

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
                    form.setFieldsValue(mod)
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

          <Row gutter={gutter} style={{ width: '100%' }} align="middle">
            <Col span={4}>
              <label>Note</label>
            </Col>
            <Col
              span={20}
              style={{ cursor: 'pointer' }}
              onClick={() => {
                form.setFieldsValue(mod)
                setEditingModIndex(index)
              }}
            >
              {mod.note ?? (
                <span style={{ color: colors.text.secondary }}>Not set</span>
              )}
            </Col>
          </Row>
        </Space>
      </div>
    ),
    [mods, currency, target],
  )

  const setReceiver = async () => {
    await form.validateFields()

    const beneficiary = form.getFieldValue('beneficiary')
    const note = form.getFieldValue('note')

    editingModIndex !== undefined && editingModIndex < mods.length
      ? onModsChanged(
          mods.map((m, i) =>
            i === editingModIndex ? { ...m, beneficiary, note } : m,
          ),
        )
      : onModsChanged([
          ...mods,
          {
            beneficiary,
            percent: 0,
            note,
          },
        ])

    form.resetFields()
    setEditingModIndex(undefined)
  }

  return (
    <Form.Item
      extra="You chan choose to commit portions of this project's funding to other Ethereum wallets. Use this to pay contributors, charities, other projects you like, or anyone else. Funding will be distributed anytime a withdrawal is made."
      label={hideLabel ? undefined : 'Beneficiaries'}
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
          Add a beneficiary ETH address
        </Button>
      </Space>

      <Modal
        title="Add wallet"
        visible={editingModIndex !== undefined}
        onOk={setReceiver}
        onCancel={() => {
          form.resetFields()
          setEditingModIndex(undefined)
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onKeyDown={e => {
            if (e.key === 'Enter') setReceiver()
          }}
        >
          <Form.Item
            name="beneficiary"
            label="Address"
            rules={[
              {
                validator: (rule, value) => {
                  if (
                    mods.some(m => m.beneficiary === value) &&
                    editingModIndex !== undefined &&
                    mods[editingModIndex].beneficiary !== value
                  )
                    return Promise.reject('Address already added.')

                  if (!utils.isAddress(value))
                    return Promise.reject('Not a valid ETH address.')
                  return Promise.resolve()
                },
              },
            ]}
          >
            <Input placeholder={constants.AddressZero} />
          </Form.Item>
          <Form.Item name="note" label="Note (optional)">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Form.Item>
  )
}
