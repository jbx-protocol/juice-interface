import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, InputNumber, Modal, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import {
  ModalMode,
  validateEthAddress,
  validatePercentage,
} from 'components/shared/formItems/formHelpers'
import { defaultSplit, Split } from 'models/v2/splits'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { fromWad, parseWad } from 'utils/formatNumber'
import {
  adjustedSplitPercents,
  getDistributionPercentFromAmount,
  getNewDistributionLimit,
} from 'utils/v2/distributions'
import { ThemeContext } from 'contexts/themeContext'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import {
  formatFee,
  formatSplitPercent,
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  splitPercentFrom,
} from 'utils/v2/math'
import NumberSlider from 'components/shared/inputs/NumberSlider'
import { amountFromPercent } from 'utils/v2/distributions'
import { BigNumber } from '@ethersproject/bignumber'

import { stringIsDigit } from 'utils/math'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import * as Moment from 'moment'
import moment from 'moment'
import TooltipLabel from 'components/shared/TooltipLabel'
import CurrencySwitch from 'components/shared/CurrencySwitch'

import { CurrencyName } from 'constants/currency'

export type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  lockedUntil: Moment.Moment | undefined | null
}

type SplitType = 'project' | 'address'
type DistributionType = 'amount' | 'percent'

// Using both state and a form in this modal. I know it seems over the top,
// but the state is necessary to link the percent and amount fields, and the form
// is useful for its features such as field validation.
export default function DistributionSplitModal({
  visible,
  mode,
  splits, // Locked and editable splits
  onSplitsChanged,
  distributionLimit,
  setDistributionLimit,
  editableSplitIndex, // index in editingSplits list (Only in the case mode==='Edit')
  onClose,
  currencyName,
  onCurrencyChange,
  editableSplits,
}: {
  visible: boolean
  mode: ModalMode // 'Add' or 'Edit' or 'Undefined'
  splits: Split[]
  onSplitsChanged: (splits: Split[]) => void
  distributionLimit: string | undefined
  setDistributionLimit: (distributionLimit: string) => void
  editableSplitIndex?: number
  onClose: VoidFunction
  currencyName: CurrencyName
  onCurrencyChange?: (currencyName: CurrencyName) => void
  editableSplits: Split[]
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [form] = useForm<AddOrEditSplitFormFields>()

  let split: Split = defaultSplit
  let initialProjectId: number | undefined
  let initialLockedUntil: Moment.Moment | undefined

  const distributionLimitIsInfinite =
    !distributionLimit || parseWad(distributionLimit).eq(MAX_DISTRIBUTION_LIMIT)

  const isFirstSplit =
    editableSplits.length === 0 ||
    (editableSplits.length === 1 && editableSplitIndex === 0)

  // If editing, format the lockedUntil and projectId
  if (editableSplits.length && editableSplitIndex !== undefined) {
    split = editableSplits[editableSplitIndex]
    initialLockedUntil = split.lockedUntil
      ? Moment.default(split.lockedUntil * 1000)
      : undefined

    if (split.projectId) {
      initialProjectId = BigNumber.from(split.projectId).toNumber()
    }
  }

  const [editingSplitType, setEditingSplitType] = useState<SplitType>(
    initialProjectId ? 'project' : 'address',
  )
  const [distributionType, setDistributionType] = useState<DistributionType>(
    distributionLimitIsInfinite ? 'percent' : 'amount',
  )
  const [projectId, setProjectId] = useState<string | undefined>(
    initialProjectId?.toString(),
  )
  const [beneficiary, setBeneficiary] = useState<string | undefined>(
    split.beneficiary,
  )
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>()
  const [percent, setPercent] = useState<number>(split.percent)
  const [amount, setAmount] = useState<number | undefined>(
    !distributionLimitIsInfinite
      ? amountFromPercent({
          percent: preciseFormatSplitPercent(split.percent),
          amount: distributionLimit,
        })
      : undefined,
  )
  const [lockedUntil, setLockedUntil] = useState<
    Moment.Moment | undefined | null
  >(initialLockedUntil)

  useLayoutEffect(() =>
    form.setFieldsValue({
      percent: parseFloat(formatSplitPercent(BigNumber.from(percent))),
      projectId,
      lockedUntil,
    }),
  )

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const feePercentage = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  useEffect(() => {
    if (
      editableSplits.length === 0 ||
      editableSplitIndex === undefined ||
      !distributionLimit
    ) {
      return
    }
    const percentPerBillion = editableSplits[editableSplitIndex].percent
    const amount = amountFromPercent({
      percent: preciseFormatSplitPercent(percentPerBillion),
      amount: distributionLimit,
    })
    setAmount(amount)
    setPercent(percentPerBillion)
  }, [distributionLimit, editableSplits, editableSplitIndex, isFirstSplit])

  const resetStates = () => {
    setProjectId(undefined)
    setBeneficiary(undefined)
    setPercent(0)
    setAmount(undefined)
    setLockedUntil(undefined)
  }

  // Validates new or newly edited split, then adds it to or edits the splits list
  const setSplit = async () => {
    await form.validateFields()

    const roundedLockedUntil = lockedUntil
      ? Math.round(lockedUntil.valueOf() / 1000)
      : undefined

    const newSplit = {
      beneficiary: beneficiary,
      percent: percent,
      lockedUntil: roundedLockedUntil,
      preferClaimed: true,
      projectId: projectId,
      allocator: undefined, // TODO: new v2 feature
    } as Split

    let adjustedSplits: Split[] = editableSplits
    // If an amount and therefore the distribution limit has been changed,
    // recalculate all split percents based on newly added split amount
    if (newDistributionLimit && distributionLimit) {
      adjustedSplits = adjustedSplitPercents({
        splits: editableSplits,
        oldDistributionLimit: distributionLimit,
        newDistributionLimit,
      })
      setDistributionLimit(newDistributionLimit)
    }

    const newSplits =
      mode === 'Edit'
        ? adjustedSplits.map((m, i) =>
            i === editableSplitIndex
              ? {
                  ...m,
                  ...newSplit,
                }
              : m,
          )
        : [...adjustedSplits, newSplit]

    onSplitsChanged(newSplits)

    form.resetFields()
    if (mode === 'Add') resetStates()

    onClose()
  }

  const onAmountChange = (newAmount: number) => {
    if (distributionLimitIsInfinite || !newAmount) return
    const newDistributionLimit = getNewDistributionLimit({
      currentDistributionLimit: distributionLimit,
      newSplitAmount: newAmount,
      editingSplitPercent:
        mode === 'Add' ? 0 : splits[editableSplitIndex ?? 0].percent, //percentPerBillion,
    })

    const newPercent = getDistributionPercentFromAmount({
      amount: newAmount,
      distributionLimit: newDistributionLimit,
    })

    setNewDistributionLimit(newDistributionLimit.toString())
    setAmount(newAmount)
    setPercent(newPercent)
    form.setFieldsValue({
      percent: parseFloat(formatSplitPercent(BigNumber.from(newPercent))),
    })
  }

  // Validates new payout receiving address
  const validatePayoutAddress = () => {
    if (
      editableSplitIndex !== undefined &&
      beneficiary === editableSplits[editableSplitIndex].beneficiary
    ) {
      return Promise.resolve()
    }
    return validateEthAddress(
      beneficiary ?? '',
      splits,
      mode,
      editableSplitIndex,
    )
  }

  const validateProjectId = () => {
    if (!stringIsDigit(form.getFieldValue('projectId'))) {
      return Promise.reject(t`Project ID is a number.`)
    }
    // TODO: check if projectId exists
    return Promise.resolve()
  }

  const validatePayoutPercentage = () => {
    return validatePercentage(form.getFieldValue('percent'))
  }

  // Cannot select days before today or today with lockedUntil
  const disabledDate = (current: moment.Moment) =>
    current && current < moment().endOf('day')

  const amountSubFee = amount
    ? amount - (amount * parseFloat(feePercentage ?? '0')) / 100
    : undefined

  function AfterFeeMessage() {
    return amount && amount > 0 ? (
      <TooltipLabel
        label={
          <Trans>
            <CurrencySymbol currency={currencyName} />
            {amountSubFee} after {feePercentage}% JBX membership fee
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
      title={mode === 'Edit' ? t`Edit existing split` : t`Add a split`}
      visible={visible}
      onOk={setSplit}
      okText={mode === 'Edit' ? t`Save split` : t`Add split`}
      onCancel={onClose}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        scrollToFirstError={{ behavior: 'smooth' }}
        onKeyDown={e => {
          if (e.key === 'Enter') setSplit()
        }}
      >
        <Form.Item>
          <Select value={editingSplitType} onChange={setEditingSplitType}>
            <Select.Option value="address">
              <Trans>Wallet address</Trans>
            </Select.Option>
            <Select.Option value="project">
              <Trans>Juicebox project</Trans>
            </Select.Option>
          </Select>
        </Form.Item>

        {editingSplitType === 'address' ? (
          <FormItems.EthAddress
            name="beneficiary"
            defaultValue={beneficiary}
            formItemProps={{
              label: t`Address`,
              rules: [
                {
                  validator: validatePayoutAddress,
                },
              ],
            }}
            onAddressChange={(beneficiary: string) =>
              setBeneficiary(beneficiary)
            }
          />
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
          <FormItems.EthAddress
            name="beneficiary"
            defaultValue={beneficiary}
            formItemProps={{
              label: t`Token beneficiary address`,
              extra: t`The address that should receive the tokens minted from paying this project.`,
            }}
            onAddressChange={beneficiary => {
              setBeneficiary(beneficiary)
            }}
          />
        ) : null}

        <Form.Item
          label={t`Distribution`}
          style={!isFirstSplit ? { marginBottom: 0 } : {}}
        >
          {isFirstSplit ? (
            <Select
              value={distributionType}
              onChange={(newType: DistributionType) => {
                if (newType === 'percent') {
                  setDistributionLimit(fromWad(MAX_DISTRIBUTION_LIMIT))
                } else if (newType === 'amount') {
                  setDistributionLimit('0')
                }
                setDistributionType(newType)
              }}
            >
              <Select.Option value="amount">
                <Trans>Specific amount</Trans>
              </Select.Option>
              <Select.Option value="percent">
                <Trans>Percent of all funds raised</Trans>
              </Select.Option>
            </Select>
          ) : null}
        </Form.Item>

        {/* Only show amount input if project distribution limit is not infinite */}
        {distributionLimit && distributionType === 'amount' ? (
          <Form.Item
            className="ant-form-item-extra-only"
            extra={
              feePercentage && percent && !(percent > 100) ? (
                <>
                  {editingSplitType === 'address' ? (
                    <div>
                      <AfterFeeMessage />
                    </div>
                  ) : (
                    <Trans>
                      Distributions to other Juicebox project do not incur any
                      fee.
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
            </div>
          </Form.Item>
        ) : (
          <Form.Item>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <span style={{ flex: 1 }}>
                <NumberSlider
                  onChange={(percent: number | undefined) => {
                    setPercent(splitPercentFrom(percent ?? 0).toNumber())
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
        )}
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
