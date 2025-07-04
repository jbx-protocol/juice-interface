import { t, Trans } from '@lingui/macro'
import { Form, Modal, Radio } from 'antd'
import { AmountPercentageInput } from 'components/Allocation/types'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { JuiceInputNumber } from 'components/inputs/JuiceInputNumber'
import { LOCKED_PAYOUT_EXPLANATION } from 'components/strings'
import { useReadJbMultiTerminalFee } from 'juice-sdk-react'
import moment, * as Moment from 'moment'
import { isInfinitePayoutLimit } from 'packages/v4/utils/fundingCycle'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  allocationInputAlreadyExistsRule,
  inputIsIntegerRule,
  inputMustBeEthAddressRule,
  inputMustExistRule,
} from 'utils/antdRules'
import { hexToInt, stripCommas } from 'utils/format/formatNumber'
import { ceilIfCloseToNextInteger } from 'utils/math'
import { Hash } from 'viem'
import { FeeTooltipLabel } from '../FeeTooltipLabel'
import { Allocation } from './Allocation'
import { AmountInput } from './components/AmountInput'
import { PercentageInput } from './components/PercentageInput'


export const allocationId = (
  beneficiary: string,
  projectId: string | undefined,
) => {
  const hasProjectId = Boolean(projectId && projectId !== '0')
  return `${beneficiary}${hasProjectId ? `-${projectId}` : ''}`
}

interface AddEditAllocationModalFormProps {
  juiceboxProjectId?: string | undefined
  address?: Hash | undefined
  amount?: AmountPercentageInput | undefined
  lockedUntil?: moment.Moment | null | undefined
}

export type AddEditAllocationModalEntity =
  | {
      projectOwner: false
      beneficiary: Hash | undefined
      projectId: string | undefined
      amount: AmountPercentageInput
      lockedUntil: number | undefined
      previousId?: string
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
  hideProjectOwnerOption,
  hideFee,
}: {
  className?: string
  allocationName: string
  editingData?: AddEditAllocationModalEntity | undefined
  availableModes: Set<'amount' | 'percentage'>
  open?: boolean
  onOk: (split: AddEditAllocationModalEntity) => void
  onCancel: VoidFunction
  hideProjectOwnerOption?: boolean
  hideFee?: boolean
}) => {
  const { data: primaryNativeTerminalFee } = useReadJbMultiTerminalFee()

  const { totalAllocationAmount, allocations, allocationCurrency } =
    Allocation.useAllocationInstance()
  const [form] = Form.useForm<AddEditAllocationModalFormProps>()
  const [amountType, setAmountType] = useState<'amount' | 'percentage'>()
  const [recipient, setRecipient] = useState<
    'walletAddress' | 'juiceboxProject' | 'projectOwner'
  >('walletAddress')

  const amount = Form.useWatch('amount', form)

  const showFee =
    amountType === 'amount' && recipient === 'walletAddress' && !hideFee

  const isValidJuiceboxProject = useMemo(
    () =>
      !editingData?.projectOwner &&
      editingData?.projectId &&
      editingData.projectId !== '0' &&
      editingData.projectId !== '0x00' &&
      editingData.projectId !== 0n.toString(),
    [editingData],
  )

  const totalAllocationPercent = allocations
    .map(a => a.percent)
    .reduce((acc, curr) => acc + curr.toFloat(), 0)

  const hasInfiniteTotalAllocationAmount: boolean = useMemo(
    () =>
      Boolean(
        totalAllocationAmount &&
          isInfinitePayoutLimit(totalAllocationAmount),
      ),
    [totalAllocationAmount],
  )

  const isEditing = !!editingData

  useEffect(() => {
    setAmountType(() => {
      if (availableModes.has('amount') && !hasInfiniteTotalAllocationAmount) {
        return 'amount'
      }
      return 'percentage'
    })
  }, [availableModes, hasInfiniteTotalAllocationAmount])

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

    setTimeout(() => {
      form.setFieldsValue({
        juiceboxProjectId: isValidJuiceboxProject
          ? hexToInt(editingData?.projectId).toString()
          : undefined,
        address: editingData.beneficiary,
        amount: editingData.amount,
        lockedUntil: editingData.lockedUntil
          ? Moment.default(editingData.lockedUntil * 1000)
          : undefined,
      })
    }, 0)
  }, [editingData, form, open, totalAllocationAmount, isValidJuiceboxProject])

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    if (!fields.amount) throw new Error('Missing amount')
    let result: AddEditAllocationModalEntity
    if (recipient === 'projectOwner') {
      result = { projectOwner: true, amount: fields.amount.value }
    } else {
      const hasEditingBeneficiary = editingData && !editingData?.projectOwner
      result = {
        projectOwner: false,
        beneficiary: fields.address,
        projectId: fields.juiceboxProjectId,
        amount: fields.amount,
        lockedUntil: fields.lockedUntil
          ? Math.round(fields.lockedUntil.valueOf() / 1000)
          : undefined,
        previousId: hasEditingBeneficiary
          ? allocationId(
              editingData?.beneficiary ?? '',
              fields.juiceboxProjectId,
            )
          : undefined,
      }
    }
    onOk(result)
    form.resetFields()
  }, [form, onOk, recipient, editingData])

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
        Paying another Juicebox project may mint its tokens. Select an address
        to receive these tokens.
      </Trans>
    ) : undefined

  const showProjectOwnerRecipientOption =
    amountType !== 'percentage' &&
    (!allocations.length ||
      ceilIfCloseToNextInteger(totalAllocationPercent) === 100) &&
    !hideProjectOwnerOption

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

  if (availableModes.size === 0) {
    console.error('AddEditAllocationModal: no available modes')
    return null
  }

  return (
    <Modal
      className={className}
      width={570}
      title={
        <h3 className="mb-0 text-xl font-medium text-black dark:text-grey-200">
          {isEditing ? t`Edit ${allocationName}` : t`Add new ${allocationName}`}
        </h3>
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
              inputIsIntegerRule({
                label: t`Juicebox Project ID`,
                stringOkay: true,
              }),
            ]}
          >
            <JuiceInputNumber className="w-full" min={1} step={1} />
          </Form.Item>
        )}
        {recipient !== 'projectOwner' && (
          <>
            <div className="mb-2 text-sm text-grey-600 dark:text-grey-400">
              <Trans>Ensure this address exists on all chains where your project is deployed</Trans>
            </div>
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
                        beneficiary: Hash
                        projectId: string
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
          </>
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
            !!primaryNativeTerminalFee && (
              <FeeTooltipLabel
                amount={BigInt(stripCommas(amount.value))}
                currency={allocationCurrency}
                feePerBillion={primaryNativeTerminalFee}
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
            extra={LOCKED_PAYOUT_EXPLANATION}
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
