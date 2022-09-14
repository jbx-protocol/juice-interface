import {
  DeleteOutlined,
  LockOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Col, Form, Row, Space, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import FormattedAddress from 'components/FormattedAddress'
import {
  validateEthAddress,
  validatePercentage,
} from 'components/formItems/formHelpers'
import { FormItemExt } from 'components/formItems/formItemExt'
import ReservedTokenReceiverModal from 'components/modals/ReservedTokenReceiverModal'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { TicketMod } from 'models/mods'
import * as moment from 'moment'
import {
  CSSProperties,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
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
  style = {},
  onModsChanged,
  formItemProps,
}: {
  lockedMods?: TicketMod[]
  mods: TicketMod[] | undefined
  reservedRate: number
  style?: CSSProperties
  onModsChanged: (mods: TicketMod[]) => void
} & FormItemExt) {
  const { owner } = useContext(V1ProjectContext)
  const {
    theme: { colors, radii },
  } = useContext(ThemeContext)

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
          style={{
            display: 'flex',
            padding: 10,
            border: locked ? '1px solid ' + colors.stroke.disabled : undefined,
            borderRadius: radii.md,
          }}
          key={mod.beneficiary ?? '' + index}
          className="clickable-border"
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
            <Row gutter={gutter} style={{ width: '100%' }} align="middle">
              <Col span={7}>
                <label>Address</label>{' '}
              </Col>
              <Col span={17}>
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

            <Row gutter={gutter} style={{ width: '100%' }} align="middle">
              <Col span={7}>
                <label>Percentage</label>
              </Col>
              <Col span={17}>
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
                    {permyriadToPercent(mod.percent)}%
                  </span>
                </div>
              </Col>
            </Row>

            {mod.lockedUntil ? (
              <Row gutter={gutter} style={{ width: '100%' }} align="middle">
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
            <LockOutlined style={{ color: colors.icon.disabled }} />
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
    [
      mods,
      colors.stroke.disabled,
      colors.text.primary,
      colors.icon.disabled,
      radii.md,
      form,
      onModsChanged,
    ],
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
      style={style}
    >
      <Space
        direction="vertical"
        style={{ width: '100%', marginBottom: 10 }}
        size="large"
      >
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
          <div style={{ textAlign: 'right' }}>
            <span
              style={{
                color:
                  total > 100 ? colors.text.failure : colors.text.secondary,
              }}
            >
              <Trans>Total: {total.toFixed(2)}%</Trans>
            </span>
          </div>
          {total < 100 ? (
            <div>
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                {owner ? (
                  <FormattedAddress address={owner} />
                ) : (
                  t`project owner`
                )}
              </Trans>
            </div>
          ) : null}
        </div>
        {totalSplitsPercentageInvalid ? (
          <span style={{ color: colors.text.failure, fontWeight: 600 }}>
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
            <Trans>Add token allocation</Trans>
          </span>
        </Button>
      </Space>
      <ReservedTokenReceiverModal
        visible={editingModIndex !== undefined}
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
