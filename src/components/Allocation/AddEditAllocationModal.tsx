import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Radio } from 'antd'
import { FeeTooltipLabel } from 'components/FeeTooltipLabel'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { JuiceInputNumber } from 'components/inputs/JuiceInputNumber'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import moment, * as Moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  allocationInputAlreadyExistsRule,
  inputIsIntegerRule,
  inputMustBeEthAddressRule,
  inputMustExistRule,
} from 'utils/antdRules'
import { parseWad, stripCommas } from 'utils/format/formatNumber'
import { ceilIfCloseToNextInteger } from 'utils/math'
import { Allocation } from './Allocation'
import { AmountInput } from './components/AmountInput'
import { PercentageInput } from './components/PercentageInput'
import { AmountPercentageInput } from './types'

interface AddEditAllocationModalFormProps {
  juiceboxProjectId?: string | undefined
  address?: string | undefined
  amount?: AmountPercentageInput | undefined
  lockedUntil?: moment.Moment | null | undefined
}

export type AddEditAllocationModalEntity =
  | {
      projectOwner: false
      beneficiary: string | undefined
      projectId: string | undefined
      amount: AmountPercentageInput
      lockedUntil: number | undefined
    }
  | {
      projectOwner: true
      amount: string
    }

export const AddEditAllocationModal = ({
  className,
  allocationName,
  editingData,
  availableModes,
  open,
  onOk,
  onCancel,
}: {
  className?: string
  allocationName: string
  editingData?: AddEditAllocationModalEntity | undefined
  availableModes: Set<'amount' | 'percentage'>
  open?: boolean
  onOk: (split: AddEditAllocationModalEntity) => void
  onCancel: VoidFunction
}) => {
  if (availableModes.size === 0) {
    console.error('AddEditAllocationModal: no available modes')
    return null
  }
  const { totalAllocationAmount, allocations, allocationCurrency } =
    Allocation.useAllocationInstance()
  const [form] = Form.useForm<AddEditAllocationModalFormProps>()
  const [amountType, setAmountType] = useState<'amount' | 'percentage'>(
    () => [...availableModes][0],
  )
  const [recipient, setRecipient] = useState<
    'walletAddress' | 'juiceboxProject' | 'projectOwner'
  >('walletAddress')

  const ethPaymentTerminalFee = useETHPaymentTerminalFee()
  const amount = Form.useWatch('amount', form)

  const showFee = amountType === 'amount' && recipient === 'walletAddress'

  const isValidJuiceboxProject = useMemo(
    () =>
      !editingData?.projectOwner &&
      editingData?.projectId &&
      editingData.projectId !== BigNumber.from(0).toHexString(),
    [editingData],
  )

  const totalAllocationPercent = allocations
    .map(a => a.percent)
    .reduce((acc, curr) => acc + curr, 0)

  const isEditing = !!editingData

  useEffect(() => {
    setAmountType(() => [...availableModes][0])
  }, [availableModes])

  useEffect(() => {
    if (!open) return

    if (!editingData) {
      setRecipient('walletAddress')
      return
    }

    if (editingData.projectOwner) {
      setRecipient('projectOwner')
      return
    }

    setRecipient(isValidJuiceboxProject ? 'juiceboxProject' : 'walletAddress')
    form.setFieldsValue({
      juiceboxProjectId: isValidJuiceboxProject
        ? editingData.projectId
        : undefined,
      address: editingData.beneficiary,
      amount: editingData.amount,
      lockedUntil: editingData.lockedUntil
        ? Moment.default(editingData.lockedUntil * 1000)
        : undefined,
    })
  }, [editingData, form, open, totalAllocationAmount, isValidJuiceboxProject])

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    if (!fields.amount) throw new Error('Missing amount')
    let result: AddEditAllocationModalEntity
    if (recipient === 'projectOwner') {
      result = { projectOwner: true, amount: fields.amount.value }
    } else {
      result = {
        projectOwner: false,
        beneficiary: fields.address,
        projectId: fields.juiceboxProjectId,
        amount: fields.amount,
        lockedUntil: fields.lockedUntil
          ? Math.round(fields.lockedUntil.valueOf() / 1000)
          : undefined,
      }
    }
    onOk(result)
    form.resetFields()
  }, [form, onOk, recipient])

  const onModalCancel = useCallback(() => {
    onCancel()
    form.resetFields()
  }, [form, onCancel])

  const addressLabel =
    recipient === 'juiceboxProject'
      ? t`Project token beneficiary address`
      : t`Address`
  const addressExtra =
    recipient === 'juiceboxProject' ? (
      <Trans>
        Distributing funds to another Juicebox project may mint its tokens. Set
        the address that should receive these project's tokens.
      </Trans>
    ) : undefined

  const showProjectOwnerRecipientOption =
    amountType !== 'percentage' &&
    (!allocations.length ||
      ceilIfCloseToNextInteger(totalAllocationPercent) === 100)

  const projectId = Form.useWatch('juiceboxProjectId', form)

  const titleCasedAllocationName = useMemo(
    () =>
      allocationName
        .toLowerCase()
        .split(' ')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1), '')
        .join(' '),
    [allocationName],
  )

  return (
    <Modal
      className={className}
      width={570}
      title={
        <h2 className="mb-0 text-lg font-medium text-black dark:text-grey-200">
          {isEditing ? t`Edit ${allocationName}` : t`Add new ${allocationName}`}
        </h2>
      }
      okText={isEditing ? t`Save ${allocationName}` : t`Add ${allocationName}`}
      open={open}
      onOk={onModalOk}
      onCancel={onModalCancel}
      destroyOnClose
    >
      <Form form={form} preserve={false} colon={false} layout="vertical">
        {availableModes.size > 1 && (
          <Radio.Group
            optionType="button"
            defaultValue="amount"
            value={amountType}
            onChange={e => setAmountType(e.target.value)}
          >
            <Radio value="amount">
              <Trans>Amounts</Trans>
            </Radio>
            <Radio value="percentage">
              <Trans>Percentages</Trans>
            </Radio>
          </Radio.Group>
        )}
        <Form.Item label={t`Recipient`}>
          <Radio.Group
            disabled={editingData?.projectOwner}
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          >
            <Radio value="walletAddress">
              <Trans>Wallet Address</Trans>
            </Radio>
            <Radio value="juiceboxProject">
              <Trans>Juicebox Project</Trans>
            </Radio>
            {showProjectOwnerRecipientOption && (
              <Radio value="projectOwner">
                <Trans>Project Owner</Trans>
              </Radio>
            )}
          </Radio.Group>
        </Form.Item>

        {recipient === 'juiceboxProject' && (
          <Form.Item
            name="juiceboxProjectId"
            label={t`Juicebox Project ID`}
            required
            rules={[
              inputMustExistRule({ label: t`Juicebox Project ID` }),
              inputIsIntegerRule({ label: t`Juicebox Project ID` }),
            ]}
          >
            <JuiceInputNumber className="w-full" min={1} step={1} />
          </Form.Item>
        )}
        {recipient !== 'projectOwner' && (
          <Form.Item
            name="address"
            label={addressLabel}
            tooltip={addressExtra}
            required
            rules={[
              inputMustExistRule({ label: addressLabel }),
              inputMustBeEthAddressRule({
                label: addressLabel,
                validateTrigger: 'onSubmit',
              }),
              allocationInputAlreadyExistsRule({
                existingAllocations: allocations
                  .map(({ beneficiary, projectId }) => ({
                    beneficiary,
                    projectId: projectId?.toString(),
                  }))
                  .filter(
                    (
                      a,
                    ): a is {
                      beneficiary: string
                      projectId: string | undefined
                    } => !!a.beneficiary,
                  ),
                inputProjectId: projectId,
                editingAddressBeneficiary: !editingData?.projectOwner
                  ? editingData?.beneficiary
                  : undefined,
              }),
            ]}
          >
            <EthAddressInput placeholder="" />
          </Form.Item>
        )}

        <Form.Item
          name="amount"
          label={
            amountType === 'amount'
              ? t`${titleCasedAllocationName} Amount`
              : t`${titleCasedAllocationName} Percentage`
          }
          required
          extra={
            !!amount?.value &&
            !!allocationCurrency &&
            showFee &&
            ethPaymentTerminalFee && (
              <FeeTooltipLabel
                amountWad={parseWad(stripCommas(amount.value))}
                currency={allocationCurrency}
                feePerBillion={ethPaymentTerminalFee}
              />
            )
          }
          rules={[
            inputMustExistRule({
              label:
                amountType === 'amount'
                  ? t`${titleCasedAllocationName} Amount`
                  : t`${titleCasedAllocationName} Percentage`,
            }),
          ]}
        >
          {amountType === 'percentage' ? <PercentageInput /> : <AmountInput />}
        </Form.Item>
        {recipient !== 'projectOwner' && (
          <Form.Item
            name="lockedUntil"
            label={t`Lock until`}
            requiredMark="optional"
            extra={
              <Trans>
                If locked, this split can't be edited or removed until the lock
                expires or the funding cycle is reconfigured.
              </Trans>
            }
          >
            <JuiceDatePicker
              placeholder=""
              disabledDate={current => current < moment().endOf('day')}
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  )
}
