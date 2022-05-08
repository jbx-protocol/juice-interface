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
import { parseWad } from 'utils/formatNumber'
import {
  getDistributionAmountFromPercentAfterFee,
  getDistributionPercentFromAmount,
} from 'utils/v2/distributions'
import { ThemeContext } from 'contexts/themeContext'

import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'

import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import {
  formatFee,
  formatSplitPercent,
  MAX_DISTRIBUTION_LIMIT,
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
  editableSplitIndex, // index in editingSplits list (Only in the case mode==='Edit')
  onClose,
  currencyName,
  editableSplits,
}: {
  visible: boolean
  mode: ModalMode // 'Add' or 'Edit' or 'Undefined'
  splits: Split[]
  onSplitsChanged: (splits: Split[]) => void
  distributionLimit: string | undefined
  editableSplitIndex?: number
  onClose: VoidFunction
  currencyName: CurrencyName
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
  const [percent, setPercent] = useState<number | undefined>()
  const [amount, setAmount] = useState<number | undefined>()
  const [lockedUntil, setLockedUntil] = useState<
    Moment.Moment | undefined | null
  >(initialLockedUntil)

  useLayoutEffect(() =>
    form.setFieldsValue({ percent, projectId, lockedUntil }),
  )

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const feePercentage = ETHPaymentTerminalFee
    ? formatFee(ETHPaymentTerminalFee)
    : undefined

  useEffect(() => {
    if (
      !editableSplits.length ||
      editableSplitIndex === undefined ||
      !distributionLimit
    ) {
      return
    }
    const percent = parseFloat(
      formatSplitPercent(
        BigNumber.from(editableSplits[editableSplitIndex].percent),
      ),
    )
    const amount = amountFromPercent({
      percent,
      amount: distributionLimit,
    })
    setAmount(amount)
    setPercent(percent)
  }, [distributionLimit, editableSplits, editableSplitIndex])

  const resetStates = () => {
    setProjectId(undefined)
    setBeneficiary(undefined)
    setPercent(undefined)
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
      percent: splitPercentFrom(percent ?? 0).toNumber(),
      lockedUntil: roundedLockedUntil,
      preferClaimed: true,
      projectId: projectId,
      allocator: undefined, // TODO: new v2 feature
    } as Split

    const newSplits =
      mode === 'Edit'
        ? editableSplits.map((m, i) =>
            i === editableSplitIndex
              ? {
                  ...m,
                  ...newSplit,
                }
              : m,
          )
        : [...editableSplits, newSplit]

    onSplitsChanged(newSplits)

    form.resetFields()
    if (mode === 'Add') resetStates()

    onClose()
  }

  const onAmountChange = (newAmount: number) => {
    if (distributionLimitIsInfinite) return

    let newPercent = getDistributionPercentFromAmount({
      amount: newAmount,
      distributionLimit,
    })
    setAmount(newAmount)
    setPercent(newPercent)
    form.setFieldsValue({ percent: newPercent })
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
    return validatePercentage(percent)
  }

  // Cannot select days before today or today with lockedUntil
  const disabledDate = (current: moment.Moment) =>
    current && current < moment().endOf('day')

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

        {/* Only show amount input if project distribution limit is not infinite */}
        {!distributionLimitIsInfinite ? (
          <Form.Item
            label={t`Payout amount`}
            className="ant-form-item-extra-only"
            extra={
              feePercentage && percent && !(percent > 100) ? (
                <>
                  {editingSplitType === 'address' ? (
                    <div>
                      <TooltipLabel
                        label={
                          <Trans>
                            <CurrencySymbol currency={currencyName} />
                            {getDistributionAmountFromPercentAfterFee({
                              percent: percent,
                              distributionLimit,
                              feePercentage,
                            })}{' '}
                            after {feePercentage}% JBX membership fee
                          </Trans>
                        }
                        tip={
                          <Trans>
                            Payouts to Ethereum addresses incur a{' '}
                            {feePercentage}% fee. Your project will receive JBX
                            in return at the current issuance rate.
                          </Trans>
                        }
                      />
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
                value={amount?.toString()}
                placeholder={'0'}
                onChange={amount => onAmountChange(parseFloat(amount || '0'))}
                formItemProps={{
                  rules: [{ validator: validatePayoutPercentage }],
                }}
                accessory={<InputAccessoryButton content={currencyName} />}
              />
            </div>
          </Form.Item>
        ) : null}

        <Form.Item
          label={
            <TooltipLabel
              label={<Trans>Percent of distribution limit</Trans>}
              tip={
                distributionLimitIsInfinite ? (
                  <Trans>
                    Percentage this payee will receive of all funds raised.
                  </Trans>
                ) : (
                  <Trans>
                    Percentage of the distribution limit this payee will
                    receive.
                  </Trans>
                )
              }
            />
          }
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ flex: 1 }}>
              <NumberSlider
                onChange={(percent: number | undefined) => {
                  let newAmount = !distributionLimitIsInfinite
                    ? amountFromPercent({
                        percent: percent ?? 0,
                        amount: distributionLimit,
                      })
                    : undefined
                  setAmount(newAmount)
                  setPercent(percent)
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
