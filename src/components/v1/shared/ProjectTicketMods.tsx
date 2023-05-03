import {
  DeleteOutlined,
  LockOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Button, Col, Form, Row, Space, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import EthereumAddress from 'components/EthereumAddress'
import {
  validateEthAddress,
  validatePercentage,
} from 'components/formItems/formHelpers'
import { FormItemExt } from 'components/formItems/formItemExt'
import ReservedTokenReceiverModal from 'components/modals/ReservedTokenReceiverModal'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { TicketMod } from 'models/v1/mods'
import * as moment from 'moment'
import { useCallback, useContext, useMemo, useState } from 'react'
import { classNames } from 'utils/classNames'
import { formatDate } from 'utils/format/formatDate'
import {
  percentToPermyriad,
  permyriadToPercent,
} from 'utils/format/formatNumber'

type ModalMode = 'Add' | 'Edit' | undefined
const gutter = 10

export default function ProjectTicketMods({
  name,
  lockedMods,
  mods,
  reservedRate,
  onModsChanged,
  formItemProps,
}: {
  lockedMods?: TicketMod[]
  mods: TicketMod[] | undefined
  reservedRate: number
  onModsChanged: (mods: TicketMod[]) => void
} & FormItemExt) {
  const { owner } = useContext(V1ProjectContext)

  const [form] = useForm<{
    beneficiary: string
    percent: number
    lockedUntil: moment.Moment
  }>()
  const [editingModIndex, setEditingModIndex] = useState<number>() // index of the mod currently being edited (edit modal open)
  const [modalMode, setModalMode] = useState<ModalMode>() //either 'Add', 'Edit' or undefined

  const modInput = useCallback(
    (mod: TicketMod, index: number, locked?: boolean) => {
      if (!mods) return

      return (
        <div
          className={classNames(
            'flex rounded-sm border p-2 transition-colors hover:border-smoke-500 dark:hover:border-slate-100',
            !locked
              ? 'border-smoke-300  dark:border-slate-300'
              : 'border-grey-200 dark:border-grey-700',
          )}
          key={mod.beneficiary ?? '' + index}
        >
          <Space
            direction="vertical"
            className={classNames(
              'w-full text-black dark:text-slate-100',
              locked ? 'cursor-default' : 'cursor-pointer',
            )}
            onClick={() => {
              if (locked) return

              const percent = parseFloat(permyriadToPercent(mod.percent))

              form.setFieldsValue({
                ...mod,
                percent,
                lockedUntil: mod.lockedUntil
                  ? moment.default(mod.lockedUntil * 1000)
                  : undefined,
              })
              setEditingModIndex(index)
              setModalMode('Edit')
            }}
          >
            <Row gutter={gutter} className="w-full" align="middle">
              <Col span={7}>
                <label>Address</label>{' '}
              </Col>
              <Col span={17}>
                <div className="flex items-center justify-between">
                  <span className="cursor-pointer">
                    <EthereumAddress address={mod.beneficiary} />
                  </span>
                </div>
              </Col>
            </Row>

            <Row gutter={gutter} className="w-full" align="middle">
              <Col span={7}>
                <label>Percentage</label>
              </Col>
              <Col span={17}>
                <div className="flex w-full items-center justify-between">
                  <span className="mr-2 w-24 max-w-[100px]">
                    {permyriadToPercent(mod.percent)}%
                  </span>
                </div>
              </Col>
            </Row>

            {mod.lockedUntil ? (
              <Row gutter={gutter} className="w-full" align="middle">
                <Col span={7}>
                  <label>Locked</label>
                </Col>
                <Col span={17}>
                  until {formatDate(mod.lockedUntil * 1000, 'yyyy-MM-DD')}
                </Col>
              </Row>
            ) : null}
          </Space>

          {locked ? (
            <LockOutlined className="text-grey-400 dark:text-grey-400" />
          ) : (
            <Tooltip title={t`Delete token allocation`}>
              <Button
                type="text"
                onClick={e => {
                  onModsChanged([
                    ...mods.slice(0, index),
                    ...mods.slice(index + 1),
                  ])
                  e.stopPropagation()
                }}
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          )}
        </div>
      )
    },
    [mods, form, onModsChanged],
  )

  if (!mods) return null

  const total = useMemo(
    () =>
      parseFloat(
        permyriadToPercent(mods.map(m => m.percent).reduce((a, b) => a + b, 0)),
      ),
    [mods],
  )

  const setReceiver = async () => {
    await form.validateFields()

    const beneficiary = form.getFieldValue('beneficiary')
    const percent = percentToPermyriad(form.getFieldValue('percent')).toNumber()
    const _lockedUntil = form.getFieldValue('lockedUntil') as moment.Moment

    const lockedUntil = _lockedUntil
      ? Math.round(_lockedUntil.valueOf() / 1000)
      : undefined

    const newMod = { beneficiary, percent, lockedUntil }

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

    setEditingModIndex(undefined)
    setModalMode(undefined)

    form.resetFields()
  }

  // Validates new reserved token receiving address
  const validateReservedTokenReceiver = () => {
    return validateEthAddress(
      form.getFieldValue('beneficiary'),
      mods,
      modalMode,
      editingModIndex,
    )
  }

  // Validates slider (ensures percent !== 0 && percent <= 100)
  const validateSlider = () => {
    return validatePercentage(form.getFieldValue('percent'))
  }

  const totalSplitsPercentageInvalid = total > 100

  return (
    <Form.Item
      name={name}
      {...formItemProps}
      rules={[
        {
          validator: () => {
            if (total > 100)
              return Promise.reject(t`Percentages must add up to 100% or less`)

            return Promise.resolve()
          },
        },
      ]}
    >
      <Space className="mb-2 w-full" direction="vertical" size="large">
        {lockedMods ? (
          <Space className="w-full" direction="vertical" size="small">
            {lockedMods.map((v, i) => modInput(v, i, true))}
          </Space>
        ) : null}
        <Space className="w-full" direction="vertical" size="small">
          {mods.map((v, i) => modInput(v, i))}
        </Space>
        <div className="flex justify-between text-grey-500 dark:text-grey-300">
          <div className="text-right">
            <span
              className={
                total > 100
                  ? 'text-error-500 dark:text-error-400'
                  : 'text-grey-500 dark:text-grey-300'
              }
            >
              <Trans>Total: {total.toFixed(2)}%</Trans>
            </span>
          </div>
          {total < 100 ? (
            <div>
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                {owner ? <EthereumAddress address={owner} /> : t`project owner`}
              </Trans>
            </div>
          ) : null}
        </div>
        {totalSplitsPercentageInvalid ? (
          <span className="font-medium text-error-500 dark:text-error-400">
            <Trans>Sum of percentages cannot exceed 100%.</Trans>
          </span>
        ) : null}
        <Button
          type="dashed"
          onClick={() => {
            setEditingModIndex(mods.length)
            setModalMode('Add')
            form.resetFields()
          }}
          block
          icon={<PlusCircleOutlined />}
        >
          <span>
            <Trans>Add token recipient</Trans>
          </span>
        </Button>
      </Space>
      <ReservedTokenReceiverModal
        open={editingModIndex !== undefined}
        onOk={setReceiver}
        mode={modalMode}
        form={form}
        onCancel={() => {
          form.resetFields()
          setEditingModIndex(undefined)
          setModalMode(undefined)
        }}
        validateReservedTokenReceiver={validateReservedTokenReceiver}
        validateSlider={validateSlider}
        reservedRate={reservedRate}
      />
    </Form.Item>
  )
}
