import { t, Trans } from '@lingui/macro'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Form, InputNumber, Modal, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import {
  ModalMode,
  validateEthAddress,
} from 'components/shared/formItems/formHelpers'
import { defaultSplit, Split } from 'models/v2/splits'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { parseWad } from 'utils/formatNumber'
import { round } from 'lodash'
import {
  adjustedSplitPercents,
  getDistributionPercentFromAmount,
  getNewDistributionLimit,
} from 'utils/v2/distributions'
import { ThemeContext } from 'contexts/themeContext'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import {
  formatFee,
  formatSplitPercent,
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  SPLITS_TOTAL_PERCENT,
} from 'utils/v2/math'
import { amountFromPercent } from 'utils/v2/distributions'
import { BigNumber } from '@ethersproject/bignumber'

import { stringIsDigit } from 'utils/math'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import * as Moment from 'moment'
import TooltipLabel from 'components/shared/TooltipLabel'

import { CurrencyName } from 'constants/currency'

export type AddOrEditSplitFormFields = {
  projectId: string
  beneficiary: string
  percent: number
  lockedUntil: Moment.Moment | undefined | null
}

type SplitType = 'project' | 'address'

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
      beneficiary,
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
    if (newDistributionLimit && !distributionLimitIsInfinite) {
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

    if (mode === 'Add') {
      resetStates()
      form.resetFields()
    }

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
      return Promise.reject(t`Project ID must be a number.`)
    }
    // TODO: check if projectId exists
    return Promise.resolve()
  }

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

        {/* Only show amount input if project distribution limit is not infinite */}
        {distributionLimit && !distributionLimitIsInfinite ? (
          <Form.Item
            className="ant-form-item-extra-only"
            extra={
              feePercentage && percent && !(percent > SPLITS_TOTAL_PERCENT) ? (
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
              {editingSplitType === 'address' ? (
                <FormattedNumberInput
                  value={amount?.toFixed(4)}
                  placeholder={'0'}
                  onChange={amount => onAmountChange(parseFloat(amount || '0'))}
                  formItemProps={{
                    label: t`Address`,
                    rules: [
                      {
                        validator: validatePayoutAddress,
                      },
                    ],
                    required: true,
                  }}
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
              <div
                style={{ marginTop: 0, marginBottom: '0.5rem' }}
                className="ant-form-item-extra"
              >
                <InfoCircleOutlined />{' '}
                <Trans>
                  Distributions to Juicebox projects don't incur fees.
                </Trans>
              </div>
            </div>
          </Form.Item>
        ) : null}
      </Form>
    </Modal>
  )
}
