import { BigNumber } from '@ethersproject/bignumber'
import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { DatePicker, Form, InputNumber, Modal, Radio } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { ModalMode, validateEthAddress } from 'components/formItems/formHelpers'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { CurrencyName } from 'constants/currency'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import findIndex from 'lodash/findIndex'
import { Split } from 'models/splits'
import moment, * as Moment from 'moment'
import { useEffect, useMemo, useState } from 'react'
import { parseWad, stripCommas } from 'utils/format/formatNumber'
import { stringIsDigit } from 'utils/math'
import {
  adjustedSplitPercents,
  amountFromPercent,
  getDistributionPercentFromAmount,
  getNewDistributionLimit,
} from 'utils/v2v3/distributions'
import {
  MAX_DISTRIBUTION_LIMIT,
  preciseFormatSplitPercent,
  splitPercentFrom,
} from 'utils/v2v3/math'
import { AmountFormItem } from './AmountFormItem'
import { PercentageFormItem } from './PercentageFormItem'
import { AddOrEditSplitFormFields, SplitType } from './types'

type DistributionType = 'amount' | 'percent' | 'both'

// Using both state and a form in this modal. I know it seems over the top,
// but the state is necessary to link the percent and amount fields, and the form
// is useful for its features such as field validation.
export function DistributionSplitModal({
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
  const [form] = useForm<AddOrEditSplitFormFields>()
  const amount = Form.useWatch('amount', form)

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
    distributionLimitIsInfinite ? 'percent' : 'amount',
  )
  const [projectId, setProjectId] = useState<string | undefined>()
  const [newDistributionLimit, setNewDistributionLimit] = useState<string>()
  const [lockedUntil, setLockedUntil] = useState<
    Moment.Moment | undefined | null
  >()

  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

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
    setDistributionType(distributionLimitIsInfinite ? 'percent' : 'amount')
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
      setProjectId(parseInt(editingSplit.projectId ?? '').toString())
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
      const newAmount = amountFromPercent({
        percent: preciseFormatSplitPercent(editingSplit.percent),
        amount: distributionLimit ?? '0',
      })
      form.setFieldsValue({ amount: newAmount.toString() })
    } else if (distributionLimit) {
      const percentPerBillion = editingSplit.percent
      const newAmount = amountFromPercent({
        percent: preciseFormatSplitPercent(percentPerBillion),
        amount: distributionLimit,
      })
      form.setFieldsValue({ amount: newAmount.toString() })
    } else {
      form.setFieldsValue({ amount: undefined })
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

  /**
   * Set new distribution limit
   */
  useEffect(() => {
    if (distributionLimitIsInfinite || !amount) return

    const newAmount = parseFloat(stripCommas(amount))

    const newDistributionLimit = getNewDistributionLimit({
      currentDistributionLimit: distributionLimit ?? '0',
      newSplitAmount: newAmount,
      editingSplitPercent: mode === 'Add' ? 0 : editingSplit?.percent ?? 0, //percentPerBillion,
    })

    const newPercent = getDistributionPercentFromAmount({
      amount: newAmount,
      distributionLimit: newDistributionLimit,
    })

    setNewDistributionLimit(newDistributionLimit.toString())
    form.setFieldsValue({
      percent: preciseFormatSplitPercent(newPercent),
    })
  }, [
    amount,
    distributionLimit,
    distributionLimitIsInfinite,
    editingSplit?.percent,
    form,
    mode,
  ])

  // Validates new payout receiving address
  const validatePayoutAddress = () => {
    const beneficiary = form.getFieldValue('beneficiary')
    if (!beneficiary) return Promise.reject('Beneficiary required')
    if (editingSplit?.beneficiary === beneficiary) {
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

  // Cannot select days before today or today with lockedUntil
  const disabledDate = (current: moment.Moment) =>
    current && current < moment().endOf('day')

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
              onChange={(projectId: number | null) => {
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
        {distributionLimit && distributionType === 'amount' ? (
          <AmountFormItem
            form={form}
            currencyName={currencyName}
            editingSplitType={editingSplitType}
            fee={ETHPaymentTerminalFee}
            isFirstSplit={isFirstSplit}
            distributionLimit={distributionLimit}
            onCurrencyChange={onCurrencyChange}
          />
        ) : (
          <PercentageFormItem form={form} />
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
