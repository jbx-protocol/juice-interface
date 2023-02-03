import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, Modal, Radio } from 'antd'
import { RuleObject } from 'antd/lib/form'
import CurrencySwitch from 'components/CurrencySwitch'
import { FeeTooltipLabel } from 'components/FeeTooltipLabel'
import { validatePercentage } from 'components/formItems/formHelpers'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { JuiceDatePicker } from 'components/inputs/JuiceDatePicker'
import { JuiceInputNumber } from 'components/inputs/JuiceInputNumber'
import NumberSlider from 'components/inputs/NumberSlider'
import { useFundingTargetType } from 'hooks/FundingTargetType'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { Split } from 'models/splits'
import moment, * as Moment from 'moment'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  allocationInputAlreadyExistsRule,
  inputIsIntegerRule,
  inputMustBeEthAddressRule,
  inputMustExistRule,
} from 'utils/antd-rules'
import { fromWad, parseWad, stripCommas } from 'utils/format/formatNumber'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { amountFromPercent } from 'utils/v2v3/distributions'
import { Allocation, AllocationSplit } from './Allocation'

interface AddEditAllocationModalFormProps {
  juiceboxProjectId?: string | undefined
  address?: string | undefined
  amount?: DistributionAmountInputValue | undefined
  lockedUntil?: moment.Moment | null | undefined
}

type AddEditAllocationModalResult = Split & { id: string }

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
  editingData?: AllocationSplit | undefined
  availableModes: Set<'amount' | 'percentage'>
  open?: boolean
  onOk: (split: AddEditAllocationModalResult) => void
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
    'walletAddress' | 'juiceboxProject'
  >('walletAddress')

  const ethPaymentTerminalFee = useETHPaymentTerminalFee()
  const amount = Form.useWatch('amount', form)

  const showFee = amountType === 'amount' && recipient === 'walletAddress'

  const isValidJuiceboxProject = useMemo(
    () =>
      editingData?.projectId &&
      editingData.projectId !== BigNumber.from(0).toHexString(),
    [editingData?.projectId],
  )

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

    setRecipient(isValidJuiceboxProject ? 'juiceboxProject' : 'walletAddress')
    form.setFieldsValue({
      juiceboxProjectId: isValidJuiceboxProject
        ? editingData.projectId
        : undefined,
      address: editingData.beneficiary,
      amount: {
        percentage: editingData.percent.toString(),
        amount: totalAllocationAmount
          ? amountFromPercent({
              percent: editingData.percent,
              amount: fromWad(totalAllocationAmount),
            }).toString()
          : undefined,
      },
      lockedUntil: editingData.lockedUntil
        ? Moment.default(editingData.lockedUntil * 1000)
        : undefined,
    })
  }, [editingData, form, open, totalAllocationAmount, isValidJuiceboxProject])

  const onModalOk = useCallback(async () => {
    const fields = await form.validateFields()
    const result: AddEditAllocationModalResult = {
      id: `${fields.address}${
        fields.juiceboxProjectId ? `-${fields.juiceboxProjectId}` : ''
      }`,
      beneficiary: fields.address,
      projectId: fields.juiceboxProjectId,
      percent: parseFloat(fields.amount!.percentage),
      lockedUntil: fields.lockedUntil
        ? Math.round(fields.lockedUntil.valueOf() / 1000)
        : undefined,
      preferClaimed: undefined,
      allocator: undefined,
    }
    onOk(result)
    form.resetFields()
  }, [form, onOk])

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

  return (
    <Modal
      className={className}
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
            value={recipient}
            onChange={e => setRecipient(e.target.value)}
          >
            <Radio value="walletAddress">
              <Trans>Wallet Address</Trans>
            </Radio>
            <Radio value="juiceboxProject">
              <Trans>Juicebox Project</Trans>
            </Radio>
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
              inputs: allocations
                .map(a => a.beneficiary)
                .filter((a): a is string => !!a),
              editingAddressBeneficiary: editingData?.beneficiary,
            }),
          ]}
        >
          <EthAddressInput placeholder="" />
        </Form.Item>

        <Form.Item
          name="amount"
          label={
            amountType === 'amount'
              ? t`Distribution Amount`
              : t`Distribution Percentage`
          }
          required
          extra={
            !!amount?.amount &&
            !!allocationCurrency &&
            showFee &&
            ethPaymentTerminalFee && (
              <FeeTooltipLabel
                amountWad={parseWad(stripCommas(amount.amount))}
                currency={allocationCurrency}
                feePerBillion={ethPaymentTerminalFee}
              />
            )
          }
          rules={[
            inputMustExistRule({
              label:
                amountType === 'amount'
                  ? t`Distribution Amount`
                  : t`Distribution Percentage`,
            }),
            distributionAmountIsValidRule({ validatorTrigger: 'onSubmit' }),
          ]}
        >
          <DistributionAmountInput mode={amountType ?? 'amount'} />
        </Form.Item>
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
      </Form>
    </Modal>
  )
}

const distributionAmountIsValidRule = (props: {
  validatorTrigger?: string
}) => ({
  validator: (
    rule: RuleObject,
    value: DistributionAmountInputValue | undefined,
  ) => {
    if (value === undefined) return Promise.resolve()
    return validatePercentage(parseFloat(value.percentage))
  },
  validatorTrigger: props.validatorTrigger,
})

type DistributionAmountInputValue = {
  amount?: string | undefined
  percentage: string
}
const DistributionAmountInput = ({
  mode,
  value,
  onChange,
}: {
  mode: 'percentage' | 'amount'
  value?: DistributionAmountInputValue
  onChange?: (input: DistributionAmountInputValue) => void
}) => {
  const [_amount, _setAmount] = useState<DistributionAmountInputValue>()
  const amount = value ?? _amount
  const setAmount = onChange ?? _setAmount

  const { allocationCurrency, setCurrency, totalAllocationAmount } =
    Allocation.useAllocationInstance()
  const fundingTargetType = useFundingTargetType(totalAllocationAmount)
  const hasSpecificFundingTarget = fundingTargetType === 'specific'

  const onAmountInputChange = useCallback(
    ({ amount, percentage }: Partial<DistributionAmountInputValue>) => {
      if (
        totalAllocationAmount &&
        hasSpecificFundingTarget &&
        amount &&
        !isNaN(parseFloat(amount))
      ) {
        const percentage = (
          (parseFloat(amount) / parseFloat(fromWad(totalAllocationAmount))) *
          100
        )
          .toFixed(2)
          .toString()

        setAmount({ amount, percentage })
        return
      }
      if (percentage) {
        let amount
        if (totalAllocationAmount && hasSpecificFundingTarget) {
          amount = amountFromPercent({
            percent: parseFloat(percentage),
            amount: fromWad(totalAllocationAmount),
          }).toString()
        }
        setAmount({ amount, percentage })
        return
      }
    },
    [totalAllocationAmount, hasSpecificFundingTarget, setAmount],
  )

  if (mode === 'amount') {
    return (
      <div className="flex w-full items-center gap-4">
        <FormattedNumberInput
          className="flex-1"
          value={amount?.amount}
          onChange={amount => onAmountInputChange({ amount })}
          accessory={
            <CurrencySwitch
              currency={
                allocationCurrency === V2V3_CURRENCY_ETH ? 'ETH' : 'USD'
              }
              onCurrencyChange={c =>
                setCurrency(c === 'ETH' ? V2V3_CURRENCY_ETH : V2V3_CURRENCY_USD)
              }
            />
          }
        />
        {
          <>
            {amount?.percentage
              ? parseFloat(amount.percentage).toPrecision(3)
              : 0}
            %
          </>
        }
      </div>
    )
  }
  if (mode === 'percentage') {
    return (
      <NumberSlider
        sliderValue={value?.percentage ? parseFloat(value.percentage) : 0}
        onChange={percentage =>
          onAmountInputChange({ percentage: percentage?.toString() })
        }
        step={0.01}
        defaultValue={0}
        suffix="%"
      />
    )
  }

  return null
}
