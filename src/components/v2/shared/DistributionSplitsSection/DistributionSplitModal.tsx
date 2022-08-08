import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, InputNumber, Modal, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import CurrencySwitch from 'components/CurrencySwitch'
import CurrencySymbol from 'components/CurrencySymbol'
import {
  ModalMode,
  validateEthAddress,
  validatePercentage,
} from 'components/formItems/formHelpers'
import InputAccessoryButton from 'components/InputAccessoryButton'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import NumberSlider from 'components/inputs/NumberSlider'
import TooltipIcon from 'components/TooltipIcon'
import TooltipLabel from 'components/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { findIndex, round } from 'lodash'
import { Split } from 'models/v2/splits'
import moment, * as Moment from 'moment'
import { useContext, useEffect, useMemo, useState } from 'react'
import { parseWad } from 'utils/formatNumber'
import { stringIsDigit } from 'utils/math'
import {
  adjustedSplitPercents,
  amountFromPercent,
  getDistributionPercentFromAmount,
  getNewDistributionLimit,
} from 'utils/v2/distributions'
import {
  formatFee,
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  splitPercentFrom,
} from 'utils/v2/math'

import { CurrencyName } from 'constants/currency'

type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  amount: number
  lockedUntil: Moment.Moment | undefined | null
}

type SplitType = 'project' | 'address'
type DistributionType = 'amount' | 'percent' | 'both'

// Using both state and a form in this modal. I know it seems over the top,
// but the state is necessary to link the percent and amount fields, and the form
// is useful for its features such as field validation.
export default function DistributionSplitModal({
  visible,
  mode,
  overrideDistTypeWithPercentage = false,
  splits, // Locked and editable splits
  editingSplit, // Split that is currently being edited (only in the case mode ==='Edit')
  onSplitsChanged,
  distributionLimit,
  setDistributionLimit,
  onClose,
  currencyName,
  onCurrencyChange,
}: {
  visible: boolean
  mode: ModalMode // 'Add' or 'Edit' or 'Undefined'
  overrideDistTypeWithPercentage?: boolean
  splits: Split[]
  editingSplit?: Split
  onSplitsChanged?: (splits: Split[]) => void
  distributionLimit?: string
  setDistributionLimit?: (distributionLimit: string) => void
  onClose: VoidFunction
  currencyName: CurrencyName
  onCurrencyChange?: (currencyName: CurrencyName) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [form] = useForm<AddOrEditSplitFormFields>()

  const distributionLimitIsInfinite = useMemo(
    () =>
      !distributionLimit ||
      parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT),
    [distributionLimit],
  )

  // true if no splits have been created, or only one split and it is selected
  const isFirstSplit = useMemo(
    () => !splits.length || (splits.length === 1 && editingSplit !== undefined),
    [editingSplit, splits.length],
  )

  const [editingSplitType, setEditingSplitType] = useState<SplitType>('address')
  const [distributionType, setDistributionType] = useState<DistributionType>(
    distributionLimitIsInfinite ? 'percent' : 'both',
  )
  const [projectId, setProjectId] = useState<string | undefined>()
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>()
  const [amount, setAmount] = useState<number | undefined>()
  const [lockedUntil, setLockedUntil] = useState<
    Moment.Moment | undefined | null
  >()
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const feePercentage = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  useEffect(() =>
    form.setFieldsValue({
      projectId,
      lockedUntil,
    }),
  )

  // Set address project id to undefined if editing type is address
  useEffect(() => {
    if (editingSplitType === 'address') {
      form.setFieldsValue({ projectId: undefined })
      setProjectId(undefined)
    }
  }, [editingSplitType, form])

  useEffect(() => {
    if (overrideDistTypeWithPercentage) {
      setDistributionType('percent')
      return
    }
    setDistributionType(distributionLimitIsInfinite ? 'percent' : 'both')
  }, [distributionLimitIsInfinite, overrideDistTypeWithPercentage, visible])

  // Set the initial info for form from split
  // If editing, format the lockedUntil and projectId
  useEffect(() => {
    if (!editingSplit) return
    setEditingSplitType('address')
    const isEditingProjectSplit =
      editingSplit.projectId &&
      !BigNumber.from(editingSplit.projectId).eq(
        BigNumber.from(constants.AddressZero),
      )
    if (isEditingProjectSplit) {
      setEditingSplitType('project')
      setProjectId(editingSplit.projectId?.toString())
    }
    setLockedUntil(
      editingSplit.lockedUntil
        ? Moment.default(editingSplit.lockedUntil * 1000)
        : undefined,
    )

    form.setFieldsValue({
      beneficiary: editingSplit.beneficiary,
      percent: preciseFormatSplitPercent(editingSplit.percent),
    })

    if (distributionLimitIsInfinite) {
      setAmount(
        amountFromPercent({
          percent: preciseFormatSplitPercent(editingSplit.percent),
          amount: distributionLimit ?? '0',
        }),
      )
    } else if (distributionLimit) {
      const percentPerBillion = editingSplit.percent
      const amount = amountFromPercent({
        percent: preciseFormatSplitPercent(percentPerBillion),
        amount: distributionLimit,
      })
      setAmount(amount)
    } else {
      setAmount(undefined)
    }
  }, [
    distributionLimit,
    distributionLimitIsInfinite,
    editingSplit,
    form,
    visible,
  ])

  const resetStates = () => {
    setProjectId(undefined)
    setAmount(undefined)
    setLockedUntil(undefined)
  }

  // Validates new or newly edited split, then adds it to or edits the splits list
  const confirmSplit = async () => {
    await form.validateFields()

    const roundedLockedUntil = lockedUntil
      ? Math.round(lockedUntil.valueOf() / 1000)
      : undefined

    const newSplit = {
      beneficiary: form.getFieldValue('beneficiary'),
      percent: splitPercentFrom(form.getFieldValue('percent')).toNumber(),
      lockedUntil: roundedLockedUntil,
      preferClaimed: true,
      projectId: projectId,
      allocator: undefined, // TODO: new v2 feature
    } as Split

    let adjustedSplits: Split[] = splits
    // If an amount and therefore the distribution limit has been changed,
    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && !distributionLimitIsInfinite) {
      adjustedSplits = adjustedSplitPercents({
        splits,
        oldDistributionLimit: distributionLimit ?? '0',
        newDistributionLimit,
      })
      setDistributionLimit?.(newDistributionLimit)
    }

    const newSplits =
      mode === 'Edit'
        ? adjustedSplits.map(m =>
            m.beneficiary === editingSplit?.beneficiary &&
            m.projectId === editingSplit?.projectId
              ? {
                  ...m,
                  ...newSplit,
                }
              : m,
          )
        : [...adjustedSplits, newSplit]

    onSplitsChanged?.(newSplits)

    resetStates()
    form.resetFields()

    onClose()
  }

  const onAmountChange = (newAmount: number) => {
    if (distributionLimitIsInfinite || !newAmount) return
    const newDistributionLimit = getNewDistributionLimit({
      currentDistributionLimit: distributionLimit ?? '0',
      newSplitAmount: newAmount,
      editingSplitPercent: mode === 'Add' ? 0 : editingSplit?.percent ?? 0, //percentPerBillion,
    })

    const newPercent = getDistributionPercentFromAmount({
      amount: newAmount,
      distributionLimit: parseFloat(distributionLimit ?? ''),
    })

    setNewDistributionLimit(newDistributionLimit.toString())

    form.setFieldsValue({ percent: preciseFormatSplitPercent(newPercent) })
  }

  // Validates new payout receiving address
  const validatePayoutAddress = () => {
    const beneficiary = form.getFieldValue('beneficiary')

    if (
      editingSplit?.beneficiary &&
      editingSplit?.beneficiary === beneficiary
    ) {
      return Promise.resolve()
    }
    return validateEthAddress(
      beneficiary ?? '',
      splits,
      mode,
      findIndex(
        splits,
        s =>
          s.beneficiary === editingSplit?.beneficiary &&
          s.projectId === editingSplit?.projectId,
      ),
      // can have a token beneficiary who is also a payout
      editingSplitType === 'project', // canBeDuplicate
    )
  }

  const validateProjectId = () => {
    if (!stringIsDigit(form.getFieldValue('projectId'))) {
      return Promise.reject(t`Project ID must be a number.`)
    }
    // TODO: check if projectId exists
    return Promise.resolve()
  }

  const validatePayoutPercentage = () => {
    return validatePercentage(
      preciseFormatSplitPercent(form.getFieldValue('percent') ?? 0),
    )
  }

  // Cannot select days before today or today with lockedUntil
  const disabledDate = (current: moment.Moment) =>
    current && current < moment().endOf('day')

  const amountSubFee = amount
    ? amount - (amount * parseFloat(feePercentage ?? '0')) / 100
    : undefined

  function AfterFeeMessage() {
    return amountSubFee && amountSubFee > 0 ? (
      <TooltipLabel
        label={
          <Trans>
            <CurrencySymbol currency={currencyName} />
            {round(amountSubFee, 4)} after {feePercentage}% JBX membership fee
          </Trans>
        }
        tip={
          <Trans>
            Payouts to Ethereum addresses incur a {feePercentage}% fee. Your
            project will receive JBX in return at the current issuance rate.
          </Trans>
        }
      />
    ) : null
  }

  return (
    <Modal
      title={mode === 'Edit' ? t`Edit payout` : t`Add new payout`}
      visible={visible}
      onOk={confirmSplit}
      okText={mode === 'Edit' ? t`Save payout` : t`Add payout`}
      onCancel={() => {
        resetStates()
        form.resetFields()
        onClose()
      }}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError={{ behavior: 'smooth' }}
        onKeyDown={e => {
          if (e.key === 'Enter') confirmSplit()
        }}
      >
        <Form.Item label={t`Recipient`}>
          <Radio.Group
            value={editingSplitType}
            onChange={e => setEditingSplitType(e.target.value)}
          >
            <Radio value="address" style={{ fontWeight: 400 }}>
              <Trans>Wallet address</Trans>
            </Radio>
            <Radio value="project" style={{ fontWeight: 400 }}>
              <Trans>Juicebox project</Trans>
            </Radio>
          </Radio.Group>
        </Form.Item>

        {editingSplitType === 'address' ? (
          <Form.Item
            name="beneficiary"
            label={t`Address`}
            rules={[
              {
                validator: validatePayoutAddress,
                validateTrigger: 'onCreate',
                required: true,
              },
            ]}
          >
            <EthAddressInput />
          </Form.Item>
        ) : (
          <Form.Item
            name={'projectId'}
            rules={[{ validator: validateProjectId }]}
            label={t`Juicebox Project ID`}
            required
          >
            <InputNumber
              value={parseInt(projectId ?? '')}
              style={{ width: '100%' }}
              placeholder={t`ID`}
              onChange={(projectId: number) => {
                setProjectId(projectId?.toString())
              }}
            />
          </Form.Item>
        )}
        {editingSplitType === 'project' ? (
          <Form.Item
            name="beneficiary"
            label={t`Token beneficiary address`}
            extra={t`The address that should receive the tokens minted from paying this project.`}
            rules={[
              {
                validator: validatePayoutAddress,
                validateTrigger: 'onCreate',
                required: true,
              },
            ]}
          >
            <EthAddressInput />
          </Form.Item>
        ) : null}

        {/* Only show amount input if project distribution limit is not infinite */}
        {distributionLimit && distributionType === 'both' ? (
          <Form.Item
            className="ant-form-item-extra-only"
            label={t`Distribution`}
            required
            extra={
              feePercentage && form.getFieldValue('percent') <= 100 ? (
                <>
                  {editingSplitType === 'address' ? (
                    <div>
                      <AfterFeeMessage />
                    </div>
                  ) : (
                    <Trans>
                      Distributing funds to Juicebox projects won't incur fees.
                    </Trans>
                  )}
                </>
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
                value={amount?.toFixed(4)}
                placeholder={'0'}
                onChange={amount => onAmountChange(parseFloat(amount || '0'))}
                formItemProps={{
                  rules: [{ validator: validatePayoutPercentage }],
                  required: true,
                }}
                accessory={
                  isFirstSplit && onCurrencyChange ? (
                    <CurrencySwitch
                      onCurrencyChange={onCurrencyChange}
                      currency={currencyName}
                    />
                  ) : (
                    <InputAccessoryButton content={currencyName} />
                  )
                }
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginLeft: 10,
                }}
              >
                <Trans>{form.getFieldValue('percent') ?? '0'}%</Trans>
                <TooltipIcon
                  tip={
                    <Trans>
                      If you don't raise the sum of all your payouts (
                      <CurrencySymbol currency={currencyName} />
                      {distributionLimit}), this address will receive{' '}
                      {form.getFieldValue('percent')}% of all the funds you
                      raise.
                    </Trans>
                  }
                  placement={'topLeft'}
                  iconStyle={{ marginLeft: 5 }}
                />
              </div>
            </div>
          </Form.Item>
        ) : null}
        <Form.Item>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <span style={{ flex: 1 }}>
              <NumberSlider
                onChange={(percentage: number | undefined) => {
                  if (!percentage) return

                  // Only trigger amount logic if distribution limit exists since Percentage input is available in both cases
                  if (distributionLimit) {
                    const newAmount = amountFromPercent({
                      percent: percentage,
                      amount: distributionLimit || '',
                    })
                    setAmount(newAmount)
                  }

                  form.setFieldsValue({ percent: percentage })
                }}
                step={0.01}
                defaultValue={0}
                sliderValue={form.getFieldValue('percent')}
                suffix="%"
                name="percent"
                formItemProps={{
                  rules: [{ validator: validatePayoutPercentage }],
                }}
              />
            </span>
          </div>
        </Form.Item>
        <Form.Item
          name="lockedUntil"
          label={t`Lock until`}
          extra={
            <Trans>
              If locked, this split can't be edited or removed until the lock
              expires or the funding cycle is reconfigured.
            </Trans>
          }
        >
          <DatePicker
            disabledDate={disabledDate}
            onChange={lockedUntil => setLockedUntil(lockedUntil)}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
