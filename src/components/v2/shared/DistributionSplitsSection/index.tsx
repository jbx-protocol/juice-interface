import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { ModalMode } from 'components/shared/formItems/formHelpers'
import { useForm } from 'antd/lib/form/Form'

import { ThemeContext } from 'contexts/themeContext'
import * as moment from 'moment'
import { useCallback, useContext, useState } from 'react'
import { permyriadToPercent, percentToPermyriad } from 'utils/formatNumber'

import { formatFee } from 'utils/v2/math'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'

import { Split } from 'models/v2/splits'
import { FormItemExt } from 'components/shared/formItems/formItemExt'

import FormattedAddress from 'components/shared/FormattedAddress'
import { getDistributionAmountFromPercentBeforeFee } from 'utils/v2/distributions'
import { V2ProjectContext } from 'contexts/v2/projectContext'

import DistributionSplitCard from './DistributionSplitCard'
import { CurrencyName } from 'constants/currency'
import DistributionSplitModal from './DistributionSplitModal'

type SplitType = 'project' | 'address'

export type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  amount: number
  lockedUntil: moment.Moment
}

export default function DistributionSplitsSection({
  distributionLimit,
  currencyName,
  splits,
  onSplitsChanged,
  formItemProps,
}: {
  distributionLimit: string | undefined
  currencyName: CurrencyName | undefined
  splits: Split[] | undefined
  onSplitsChanged: (splits: Split[]) => void
} & FormItemExt) {
  const [addOrEditSplitForm] = useForm<AddOrEditSplitFormFields>()
  const [modalMode, setModalMode] = useState<ModalMode>() //either 'Add', 'Edit' or undefined
  const [editingSplitIndex, setEditingSplitIndex] = useState<number>()
  const [editingPercent, setEditingPercent] = useState<number>()
  const [editingSplitType, setEditingSplitType] = useState<SplitType>('address')
  console.info('editingSplitType: ', editingSplitType)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { projectOwnerAddress } = useContext(V2ProjectContext)

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const feePercentage = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  // const feePerbicent = percentToPerbicent(feePercentage)

  const renderSplitCard = useCallback(
    (split: Split, index: number, locked?: boolean) => {
      if (!split || !feePercentage) return

      return (
        <DistributionSplitCard
          split={split}
          index={index}
          feePercentage={feePercentage}
          onClick={() => {
            if (locked) return

            const percent = parseFloat(permyriadToPercent(split.percent))

            setEditingSplitType(split.projectId ? 'project' : 'address')
            setModalMode('Edit')
            setEditingSplitIndex(index)
            setEditingPercent(percent)

            addOrEditSplitForm.setFieldsValue({
              ...split,
              percent,
              amount: parseFloat(
                getDistributionAmountFromPercentBeforeFee({
                  percent: editingPercent ?? percent,
                  distributionLimit,
                }),
              ),
              lockedUntil: split.lockedUntil
                ? moment.default(split.lockedUntil * 1000)
                : undefined,
            })
          }}
          onDelete={() => console.info('delete')}
        />
      )
    },
    [distributionLimit, addOrEditSplitForm, editingPercent, feePercentage],
  )

  if (!splits) return null

  const total = splits.reduce(
    (acc, curr) => acc + parseFloat(permyriadToPercent(curr.percent ?? '0')),
    0,
  )

  // Validates
  const setReceiver = async () => {
    await addOrEditSplitForm.validateFields()

    const handle = addOrEditSplitForm.getFieldValue('handle')
    const beneficiary = addOrEditSplitForm.getFieldValue('beneficiary')
    const percent = percentToPermyriad(
      addOrEditSplitForm.getFieldValue('percent'),
    ).toNumber()
    const _lockedUntil = addOrEditSplitForm.getFieldValue(
      'lockedUntil',
    ) as moment.Moment

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
      editingSplitIndex !== undefined && editingSplitIndex < splits.length
        ? splits.map((m, i) =>
            i === editingSplitIndex
              ? {
                  ...m,
                  ...newSplit,
                }
              : m,
          )
        : [...splits, newSplit],
    )

    setEditingSplitIndex(undefined)
    setEditingPercent(0)
    addOrEditSplitForm.resetFields()
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
        <Space style={{ width: '100%' }} direction="vertical" size="small">
          {splits.map((v, i) => renderSplitCard(v, i))}
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
            {projectOwnerAddress ? (
              <Trans>
                {(100 - total).toFixed(2)}% to{' '}
                <FormattedAddress address={projectOwnerAddress} />
              </Trans>
            ) : null}
          </div>
        </div>
        <Button
          type="dashed"
          onClick={() => {
            setModalMode('Add')
            setEditingSplitIndex(splits.length)
            setEditingPercent(0)
            // setEditingSplitProjectId(undefined)
            addOrEditSplitForm.resetFields()
          }}
          block
        >
          <Trans>Add a payout</Trans>
        </Button>
      </Space>

      <DistributionSplitModal
        visible={editingSplitIndex !== undefined}
        form={addOrEditSplitForm}
        mode={modalMode}
        splits={splits}
        setEditingPercent={setEditingPercent}
        distributionLimit={distributionLimit}
        editingSplitIndex={editingSplitIndex}
        onOk={setReceiver}
        onCancel={() => {
          addOrEditSplitForm.resetFields()
          setEditingSplitIndex(undefined)
          // setEditingSplitProjectId(undefined)
        }}
      />
    </Form.Item>
  )
}
